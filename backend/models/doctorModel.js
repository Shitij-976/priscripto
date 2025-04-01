import mongoose from "mongoose";

const doctorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }, // Fixed "passwords" typo
    image: { type: String, required: true },
    speciality: { type: String, required: true },
    degree: { type: String, required: true },
    experience: { type: String, required: true },
    about: { type: String, required: true },
    available: { type: Boolean, default: true },
    fees: { type: Number, required: true }, // Fixed "requried" typo
    address: { type: Object, required: true },
    date: { type: Date, required: true }, // Changed from Number to Date for better handling
    slot_booked: { type: Map, of: Boolean, default: {} }, // Use Map for better key-value storage
  },
  { minimize: false }
);

const doctorModel =
  mongoose.models.doctor || mongoose.model("doctor", doctorSchema);

export default doctorModel;
