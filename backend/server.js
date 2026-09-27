import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './config/mongodb.js';
import connectCloudinary from './config/cloudinary.js';
import adminRouter from './routes/adminRoute.js';
import doctorRouter from './routes/doctorRoute.js';
import path from 'path';
import userRouter from './routes/userRoute.js';

// 🌐 App config
const app = express();
const port = process.env.PORT || 4000;

// 🔗 Connect to DB and Cloudinary
connectDB();
connectCloudinary();

// 🛠️ Middleware
app.use(express.json());
app.use(cors());
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// 🚀 API endpoints
app.use('/api/admin', adminRouter);
app.use('/api/doctor', doctorRouter);
app.use('/api/user', userRouter);

// 🏠 Root endpoint
app.get('/', (req, res) => {
  res.send('🌟 Server is working');
});

// ⚠️ Error handling middleware
app.use((err, req, res, next) => {
  console.error(`❌ Error: ${err.message}`);
  res.status(500).json({ message: err.message });
});

// 🚀 Start server (Render + Localhost)
app.listen(port, '0.0.0.0', () => {
  console.log(`✅ Server started on port ${port} 🚀`);
});

export default app;