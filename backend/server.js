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
connectDB(); // ✅ MongoDB connected
connectCloudinary(); // ☁️ Cloudinary connected

// 🛠️ Middleware
app.use(express.json()); // 📦 Parse JSON
app.use(cors()); // 🌍 Enable CORS
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads'))); // 📂 Serve uploaded files

// 🚀 API endpoints
app.use('/api/admin', adminRouter); // 🛡️ Admin routes
app.use('/api/doctor', doctorRouter); // 👨‍⚕️ Doctor routes
app.use('/api/user', userRouter); // 👤 User routes


// 🏠 Root endpoint
app.get('/', (req, res) => {
  res.send('🌟 Server is working');
});

// ⚠️ Error handling middleware
app.use((err, req, res, next) => {
  console.error(`❌ Error: ${err.message}`);
  res.status(500).json({ message: err.message });
});

// 🚀 Start server
if (process.env.NODE_ENV !== 'production') {
  app.listen(port, () => console.log(`✅ Server started on port ${port} 🚀`));
}

export default app;
