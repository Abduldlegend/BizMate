import express from 'express';
import StockList from '../models/StockList.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.get('/', auth, async (req, res) => {
  const docs = await StockList.find({ userId: req.user.id }).sort({ createdAt: -1 });
  res.json(docs);
});
router.post('/', auth, async (req, res) => {
  const doc = await StockList.create({ ...req.body, userId: req.user.id });
  res.status(201).json(doc);
});
router.put('/:id', auth, async (req, res) => {
  const doc = await StockList.findOneAndUpdate({ _id: req.params.id, userId: req.user.id }, req.body, { new: true });
  res.json(doc);
});
router.delete('/:id', auth, async (req, res) => {
  await StockList.deleteOne({ _id: req.params.id, userId: req.user.id });
  res.json({ ok: true });
});

export default router;
