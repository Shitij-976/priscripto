import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './config/mongodb.js';
import connectCloudinary from './config/cloudinary.js';
import adminRouter from './routes/adminRoute.js';

const app = express();
const port = process.env.PORT || 4000;

app.use(express.json());
app.use(cors());
connectDB();
connectCloudinary()
// API endpoint
app.use('/api/admin',adminRouter)
app.get('/', (req, res) => {
    res.send('API WORKING');
});

app.listen(port, () => console.log('Server running on port', port));
