// backend/models/Alert.js
import mongoose from "mongoose";

const AlertSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
  type: { type: String, enum: ["low-stock","fast-selling","dormant","reorder-suggest"], required: true },
  message: { type: String, required: true },
  severity: { type: String, enum: ["info","warning","critical"], default: "warning" },
  meta: Object,
  resolved: { type: Boolean, default: false },
  resolvedAt: Date
}, { timestamps: true });

export default mongoose.models.Alert || mongoose.model("Alert", AlertSchema);
