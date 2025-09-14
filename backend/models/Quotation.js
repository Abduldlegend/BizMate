import mongoose from 'mongoose';

const ItemSchema = new mongoose.Schema({
  itemName: String,
  quantity: Number,
  unit: String,
  price: Number,
  total: Number,
}, { _id: false });

const QuotationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  businessName: String,
  motto: String,
  items: [ItemSchema],
  grandTotal: Number,
}, { timestamps: true });

export default mongoose.model('Quotation', QuotationSchema);
