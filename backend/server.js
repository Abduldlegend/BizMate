import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import connectDB from './config/db.js';
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import quotationRoutes from './routes/quotations.js';
import stocklistRoutes from './routes/stocklists.js';
import inventoryRoutes from "./routes/inventoryRoutes.js";
import invoiceRoutes from "./routes/invoiceRoutes.js"

dotenv.config();
const app = express();

// DB
connectDB();

// Middleware
app.use(express.json());
app.use(morgan('dev'));
app.use(cors({
  origin: process.env.CLIENT_URL?.split(',') || '*',
  credentials: true
}));

// Routes
app.get('/', (_req, res) => res.json({ status: 'BizMate API OK' }));
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/quotations', quotationRoutes);
app.use('/api/stocklists', stocklistRoutes);
app.use("/api/inventory", inventoryRoutes);
app.use('/api/invoices', invoiceRoutes);


// Start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
