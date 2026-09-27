import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URI?.trim();
    const dbName = process.env.MONGODB_DB_NAME?.trim() || 'prescripto';

    if (!uri) {
      throw new Error('MONGODB_URI is not defined in environment variables.');
    }

    mongoose.connection.on('connected', () => console.log("✅ Database connected successfully! 🚀"));
    mongoose.connection.on('error', (err) => console.error("❌ Database connection error:", err));

    await mongoose.connect(uri, {
      dbName,
      family: 4,
      serverSelectionTimeoutMS: 15000,
    });

  } catch (error) {
    console.error("⚠️ Database connection failed:", error.message);
    process.exit(1); // Exit process on failure
  }
};

export default connectDB;
