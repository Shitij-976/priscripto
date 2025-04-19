import validator from "validator";
import bcrypt from "bcrypt";
import { v2 as cloudinary } from "cloudinary";
import doctorModel from "../models/doctorModel.js";
import jwt from "jsonwebtoken";

const addDoctor = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      speciality,
      degree,
      experience,
      about,
      fees,
      address,
    } = req.body;

    const imageFile = req.file;

    // Debugging: Log the request body and file
    console.log("Request body:", req.body);
    console.log("Uploaded file:", req.file);

    // Validate required fields
    if (
      !name ||
      !email ||
      !password ||
      !speciality ||
      !degree ||
      !experience ||
      !about ||
      !fees ||
      !address
    ) {
      console.error("Missing details:", {
        name,
        email,
        password,
        speciality,
        degree,
        experience,
        about,
        fees,
        address,
      });
      return res
        .status(400)
        .json({ success: false, message: "Missing details" });
    }

    // Validate email format
    if (!validator.isEmail(email)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid email format" });
    }

    // Validate password strength
    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters long",
      });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Check if image file exists
    if (!imageFile) {
      return res
        .status(400)
        .json({ success: false, message: "Image file is required" });
    }

    // Upload image to Cloudinary
    const imageUploader = await cloudinary.uploader.upload(imageFile.path, {
      resource_type: "image",
    });
    const imageUrl = imageUploader.secure_url;

    // Parse address if it's a JSON string
    let parsedAddress;
    try {
      parsedAddress =
        typeof address === "string" ? JSON.parse(address) : address;
    } catch (error) {
      console.error("Invalid address format:", address);
      return res
        .status(400)
        .json({ success: false, message: "Invalid address format" });
    }

    // Prepare doctor data
    const doctorData = {
      name,
      email,
      password: hashedPassword,
      image: imageUrl,
      speciality,
      degree,
      experience,
      about,
      fees,
      address: parsedAddress,
      date: Date.now(),
    };

    // Save doctor to the database
    const newDoctor = new doctorModel(doctorData);
    await newDoctor.save();

    // Send success response
    res.status(201).json({
      success: true,
      message: "Doctor added successfully",
      doctor: newDoctor,
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message }); 
  }
};
//api for admin login
const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (email === process.env.ADMIN_EMAIL &&password === process.env.ADMIN_PASSWORD) {
      const token = jwt.sign(email+password, process.env.JWT_SECRET)
      res.status(200).json({
        success: true,
        message: "Login successful",
        token,
      });
    } else {
      return res
        .status(400)
        .json({ success: false, message: "Invalid email or password" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message }); 
  }
};
// ApI  to get all doctor list
const allDoctors = async (req, res) => {
  try {
    const doctors = await doctorModel.find({}).select( '-password' );
    res.status(200).json({
      success: true,
      message: "Doctor list fetched successfully",
      doctors,
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message }); 
  }
};  
export { addDoctor, loginAdmin,allDoctors};