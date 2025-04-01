import mongoose from "mongoose";

const connectDB = async () => {
  try {
    mongoose.connection.on('connected', () => console.log("✅ Database connected successfully! 🚀"));
    mongoose.connection.on('error', (err) => console.error("❌ Database connection error:", err));

    await mongoose.connect(`${process.env.MONGODB_URI}/prescripto`); // Removed deprecated options

  } catch (error) {
    console.error("⚠️ Database connection failed:", error);
    process.exit(1); // Exit process on failure
  }
};

export default connectDB;
