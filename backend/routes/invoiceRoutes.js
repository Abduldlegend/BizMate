// backend/routes/invoiceRoutes.js
import express from "express";
import mongoose from "mongoose";
import Invoice from "../models/Invoice.js";
import Counter from "../models/Counter.js";
import Product from "../models/Product.js";
import Transaction from "../models/Transaction.js";

const router = express.Router();

/** Utility: getNextSequence for invoice number */
async function getNextInvoiceNumber() {
  // Format: INV-YYYYMMDD-0001
  const today = new Date();
  const datePart = today.toISOString().slice(0,10).replace(/-/g,""); // YYYYMMDD
  const counterName = `invoice-${datePart}`;

  const updated = await Counter.findOneAndUpdate(
    { name: counterName },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );

  const seq = String(updated.seq).padStart(4, "0");
  return `INV-${datePart}-${seq}`;
}

/** Create Invoice
 *  POST /api/invoices
 *  Body: { customer, items[], tax, discount, dueDate, status, notes, sourceRef }
 *  If status === 'Paid' -> decrement stock & create Transaction entries inside a session
 */
router.post("/", async (req, res) => {
  const session = await mongoose.startSession();
  try {
    const {
      customer,
      items = [],
      tax = 0,
      discount = 0,
      dueDate,
      status = "Pending",
      notes,
      sourceRef
    } = req.body;

    // compute totals
    const subtotal = items.reduce((s, it) => s + (Number(it.price || 0) * Number(it.quantity || 0)), 0);
    const totalAmount = subtotal + Number(tax || 0) - Number(discount || 0);

    // invoice number
    const invoiceNumber = await getNextInvoiceNumber();

    const invoice = new Invoice({
      invoiceNumber,
      customer,
      items: items.map(it => ({
        productId: it.productId || null,
        name: it.name,
        description: it.description || "",
        quantity: Number(it.quantity || 0),
        price: Number(it.price || 0),
        total: Number(it.quantity || 0) * Number(it.price || 0),
      })),
      subtotal,
      tax,
      discount,
      totalAmount,
      status,
      dueDate,
      notes,
      sourceRef
    });

    // If status === Paid -> perform stock decrement + log transactions atomically
    if (status === "Paid") {
      session.startTransaction();
      await invoice.save({ session });

      for (const it of invoice.items) {
        if (!it.productId) continue;
        const product = await Product.findById(it.productId).session(session);
        if (!product) {
          await session.abortTransaction();
          return res.status(404).json({ error: `Product ${it.name} not found` });
        }
        if ((product.quantity || 0) < it.quantity) {
          await session.abortTransaction();
          return res.status(400).json({ error: `Insufficient stock for ${product.name}` });
        }
        // decrement
        product.quantity = product.quantity - it.quantity;
        await product.save({ session });

        // record transaction
        await Transaction.create([{
          productId: product._id,
          productName: product.name,
          sku: product.sku,
          quantity: it.quantity,
          type: "sale",
          sellingPrice: it.price
        }], { session });
      }

      await session.commitTransaction();
      session.endSession();
      // emit socket events if you have socket integration (optional)
      return res.status(201).json(invoice);
    } else {
      // not paid: just save
      await invoice.save();
      return res.status(201).json(invoice);
    }
  } catch (err) {
    await session.abortTransaction().catch(()=>{});
    session.endSession();
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

/** GET all invoices
 * GET /api/invoices?search=&status=&page=&limit=
 */
router.get("/", async (req, res) => {
  try {
    const { page = 1, limit = 100, status, q } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (q) filter.$or = [
      { "customer.name": { $regex: q, $options: "i" } },
      { invoiceNumber: { $regex: q, $options: "i" } }
    ];

    const invoices = await Invoice.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await Invoice.countDocuments(filter);
    res.json({ invoices, total });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

/** GET a single invoice */
router.get("/:id", async (req, res) => {
  try {
    const inv = await Invoice.findById(req.params.id);
    if (!inv) return res.status(404).json({ error: "Invoice not found" });
    res.json(inv);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

/** Update invoice status
 * PUT /api/invoices/:id/status
 * Body: { status }   // if changing to Paid -> decrement stock & create transactions
 */
router.put("/:id/status", async (req, res) => {
  const session = await mongoose.startSession();
  try {
    const { status } = req.body;
    const inv = await Invoice.findById(req.params.id);
    if (!inv) return res.status(404).json({ error: "Invoice not found" });

    // if already paid and now setting to something else => we won't auto-restock here (complex)
    // If moving to Paid from not-Paid => decrement stock
    if (inv.status !== "Paid" && status === "Paid") {
      session.startTransaction();
      for (const it of inv.items) {
        if (!it.productId) continue;
        const product = await Product.findById(it.productId).session(session);
        if (!product) {
          await session.abortTransaction();
          return res.status(404).json({ error: `Product ${it.name} not found` });
        }
        if ((product.quantity || 0) < it.quantity) {
          await session.abortTransaction();
          return res.status(400).json({ error: `Insufficient stock for ${product.name}` });
        }
        product.quantity = product.quantity - it.quantity;
        await product.save({ session });

        // create sale transaction
        await Transaction.create([{
          productId: product._id,
          productName: product.name,
          sku: product.sku,
          quantity: it.quantity,
          type: "sale",
          sellingPrice: it.price
        }], { session });
      }
      inv.status = "Paid";
      await inv.save({ session });
      await session.commitTransaction();
      session.endSession();
      return res.json(inv);
    } else {
      inv.status = status;
      await inv.save();
      return res.json(inv);
    }
  } catch (err) {
    await session.abortTransaction().catch(()=>{});
    session.endSession();
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

/** Delete invoice */
router.delete("/:id", async (req, res) => {
  try {
    await Invoice.findByIdAndDelete(req.params.id);
    res.json({ message: "Invoice deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
