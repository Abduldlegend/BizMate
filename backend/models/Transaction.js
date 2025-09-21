
// backend/models/Transaction.js
import mongoose from "mongoose";

const TransactionSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  productName: { type: String, required: true },
  sku: { type: String, required: true },
  quantity: { type: Number, required: true },
  type: { type: String, enum: ["sale","restock","adjust"], required: true },
  costPrice: Number,
  sellingPrice: Number,
  supplier: String,
  note: String,
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
}, { timestamps: true });

export default mongoose.models.Transaction || mongoose.model("Transaction", TransactionSchema);
