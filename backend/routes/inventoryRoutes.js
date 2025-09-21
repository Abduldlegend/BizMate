
// backend/routes/inventoryRoutes.js
import express from "express";
import mongoose from "mongoose";
import Product from "../models/Product.js";
import Transaction from "../models/Transaction.js";
import Alert from "../models/Alert.js";

const router = express.Router();

/**
 * Utility: emit helper (server injects io on req.app.locals.io)
 */
function emit(event, payload, req){
  const io = req.app?.locals?.io;
  if(io) io.emit(event, payload);
}

/* PRODUCTS */

// GET /api/inventory/products?q=&category=
router.get("/products", async (req, res) => {
  try {
    const { q, category, page = 1, limit = 200 } = req.query;
    const filter = { archived: false };
    if (q) filter.$or = [{ name: { $regex: q, $options: "i" } }, { sku: { $regex: q, $options: "i" } }];
    if (category) filter.category = category;
    const products = await Product.find(filter)
      .sort({ updatedAt: -1 })
      .skip((page-1)*limit)
      .limit(Number(limit));
    const total = await Product.countDocuments(filter);
    res.json({ products, total });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// POST /api/inventory/products
router.post("/products", async (req, res) => {
  try {
    const payload = req.body;
    const p = new Product(payload);
    await p.save();
    emit("inventory:update", p, req);
    res.status(201).json(p);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
});

// GET single
router.get("/products/:id", async (req, res) => {
  try {
    const p = await Product.findById(req.params.id);
    if(!p) return res.status(404).json({ error: "Not found" });
    res.json(p);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/inventory/products/:id  (used for edits & restock)
router.put("/products/:id", async (req, res) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    const update = req.body;
    // Allow restock via quantity increment if client sets e.g. { restock: 10 }
    let product = await Product.findById(req.params.id).session(session);
    if(!product){ await session.abortTransaction(); return res.status(404).json({ error: "Not found" }); }

    // If restock provided as restock qty
    if(update.restock && Number(update.restock) !== 0){
      const qty = Number(update.restock);
      product.quantity = (product.quantity || 0) + qty;
      // create transaction
      const tx = await Transaction.create([{
        productId: product._id,
        productName: product.name,
        sku: product.sku,
        quantity: qty,
        type: "restock",
        costPrice: update.costPrice ?? product.costPrice,
        supplier: update.supplier ?? product.supplier
      }], { session });

      // apply other changes (name, prices etc.)
      delete update.restock;
      await Product.findByIdAndUpdate(product._id, update, { new: true, session });
      const updated = await Product.findById(product._id).session(session);

      await session.commitTransaction();
      emit("transactions:new", tx[0], req);
      emit("inventory:update", updated, req);
      // clear alerts if resolved
      if(updated.quantity > (updated.reorderLevel || 0)){
        await Alert.updateMany({ productId: updated._id, type: "low-stock", resolved: false }, { resolved: true, resolvedAt: new Date() });
      }
      return res.json({ product: updated, transaction: tx[0] });
    } else {
      // Normal update (no restock)
      const updated = await Product.findByIdAndUpdate(req.params.id, update, { new: true, session });
      await session.commitTransaction();
      emit("inventory:update", updated, req);
      return res.json(updated);
    }
  } catch (err) {
    await session.abortTransaction();
    console.error(err);
    res.status(400).json({ error: err.message });
  } finally {
    session.endSession();
  }
});

// DELETE (soft)
router.delete("/products/:id", async (req, res) => {
  try {
    const p = await Product.findByIdAndUpdate(req.params.id, { archived: true }, { new: true });
    emit("inventory:deleted", { id: req.params.id }, req);
    res.json({ message: "Deleted", product: p });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* TRANSACTIONS */

// POST sale
router.post("/transactions/sale", async (req, res) => {
  const session = await mongoose.startSession();
  try{
    session.startTransaction();
    const { productId, quantity, sellingPrice, note, createdBy } = req.body;
    const qty = Number(quantity);
    if(qty <= 0) throw new Error("Quantity must be > 0");

    const product = await Product.findById(productId).session(session);
    if(!product) { await session.abortTransaction(); return res.status(404).json({ error: "Product not found" }); }
    if((product.quantity || 0) < qty) { await session.abortTransaction(); return res.status(400).json({ error: "Insufficient stock" }); }

    product.quantity = product.quantity - qty;
    await product.save({ session });

    const tx = await Transaction.create([{
      productId: product._id,
      productName: product.name,
      sku: product.sku,
      quantity: qty,
      type: "sale",
      sellingPrice: sellingPrice ?? product.sellingPrice,
      note,
      createdBy
    }], { session });

    // create low-stock alert if below reorderLevel
    if(product.quantity <= (product.reorderLevel || 0)){
      await Alert.create([{ productId: product._id, type: "low-stock", message: `${product.name} is low on stock`, meta: { qty: product.quantity } }], { session });
      emit("alerts:new", { productId: product._id, type: "low-stock" }, req);
    }

    await session.commitTransaction();
    emit("transactions:new", tx[0], req);
    emit("inventory:update", product, req);
    res.status(201).json({ transaction: tx[0], product });
  }catch(err){
    await session.abortTransaction();
    console.error(err);
    res.status(400).json({ error: err.message });
  }finally{
    session.endSession();
  }
});

// POST restock (alternative to using product PUT with restock)
router.post("/transactions/restock", async (req, res) => {
  const session = await mongoose.startSession();
  try{
    session.startTransaction();
    const { productId, quantity, costPrice, supplier, createdBy } = req.body;
    const qty = Number(quantity);
    if(qty <= 0) throw new Error("Quantity must be > 0");

    const product = await Product.findById(productId).session(session);
    if(!product){ await session.abortTransaction(); return res.status(404).json({ error: "Product not found" }); }

    product.quantity = (product.quantity || 0) + qty;
    if(costPrice) product.costPrice = costPrice;
    await product.save({ session });

    const tx = await Transaction.create([{
      productId: product._id,
      productName: product.name,
      sku: product.sku,
      quantity: qty,
      type: "restock",
      costPrice,
      supplier,
      createdBy
    }], { session });

    await session.commitTransaction();
    emit("transactions:new", tx[0], req);
    emit("inventory:update", product, req);
    // resolve low-stock alerts if any
    if(product.quantity > (product.reorderLevel || 0)){
      await Alert.updateMany({ productId: product._id, type: "low-stock", resolved: false }, { resolved: true, resolvedAt: new Date() });
    }
    res.status(201).json({ transaction: tx[0], product });
  }catch(err){
    await session.abortTransaction();
    console.error(err);
    res.status(400).json({ error: err.message });
  }finally{
    session.endSession();
  }
});

// GET transactions (filters)
router.get("/transactions", async (req, res) => {
  try {
    const { productId, type, page = 1, limit = 100 } = req.query;
    const filter = {};
    if(productId) filter.productId = productId;
    if(type) filter.type = type;
    const txs = await Transaction.find(filter).sort({ createdAt: -1 }).skip((page-1)*limit).limit(Number(limit));
    res.json({ txs });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ALERTS */

router.get("/alerts", async (req, res) => {
  try {
    const alerts = await Alert.find({ resolved: false }).sort({ createdAt: -1 }).limit(200);
    res.json({ alerts });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.patch("/alerts/:id/resolve", async (req, res) => {
  try {
    const a = await Alert.findByIdAndUpdate(req.params.id, { resolved: true, resolvedAt: new Date() }, { new: true });
    emit("alerts:resolved", a, req);
    res.json(a);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* REPORTS */

// summary
router.get("/reports/summary", async (req, res) => {
  try {
    const products = await Product.find({});
    const stockValue = products.reduce((s,p)=> s + ((p.costPrice||0) * (p.quantity||0)), 0);

    // total sales/purchases (naive)
    const salesAgg = await Transaction.aggregate([
      { $match: { type: "sale" } },
      { $group: { _id: null, totalQty: { $sum: "$quantity" }, totalValue: { $sum: { $multiply: ["$quantity", "$sellingPrice"] } } } }
    ]);

    const purchasesAgg = await Transaction.aggregate([
      { $match: { type: "restock" } },
      { $group: { _id: null, totalQty: { $sum: "$quantity" }, totalValue: { $sum: { $multiply: ["$quantity", "$costPrice"] } } } }
    ]);

    res.json({
      stockValue,
      totalSales: salesAgg[0] || { totalQty:0, totalValue:0 },
      totalPurchases: purchasesAgg[0] || { totalQty:0, totalValue:0 }
    });
  } catch(err) {
    res.status(500).json({ error: err.message });
  }
});

// top-selling
router.get("/reports/top-selling", async (req, res) => {
  try{
    const { limit = 5 } = req.query;
    const agg = await Transaction.aggregate([
      { $match: { type: "sale" } },
      { $group: { _id: "$productId", totalQty: { $sum: "$quantity" } } },
      { $lookup: { from: "products", localField: "_id", foreignField: "_id", as: "product" } },
      { $unwind: "$product" },
      { $sort: { totalQty: -1 } },
      { $limit: Number(limit) },
      { $project: { product: "$product", totalQty: 1 } }
    ]);
    res.json({ top: agg });
  }catch(err){
    res.status(500).json({ error: err.message });
  }
});

// low-stock report
router.get("/reports/low-stock", async (req, res) => {
  try {
    const list = await Product.find({ $expr: { $lte: ["$quantity", "$reorderLevel"] } }).sort({ quantity: 1 }).limit(200);
    res.json({ low: list });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
