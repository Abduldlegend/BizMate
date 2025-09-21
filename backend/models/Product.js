
// backend/models/Product.js
import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  sku: { type: String, required: true, trim: true, unique: true },
  category: { type: String, required: true, index: true },
  subCategory: { type: String },
  description: { type: String },
  unit: { type: String, default: "pcs" },
  supplier: { type: String },
  costPrice: { type: Number, default: 0 },
  sellingPrice: { type: Number, default: 0 },
  quantity: { type: Number, default: 0 },
  reorderLevel: { type: Number, default: 5 },
  archived: { type: Boolean, default: false },
  meta: { type: Object }
}, { timestamps: true });

export default mongoose.models.Product || mongoose.model("Product", ProductSchema);
