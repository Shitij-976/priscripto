import validator from "validator";
import bcrypt from "bcrypt";
import { v2 as cloudinary } from "cloudinary";
import doctorModel from "../models/doctorModel.js";
import jwt from "jsonwebtoken";
import appointmentModel from "../models/appointmentModel.js";
import React from "react";
import { sendNotificationEmail } from "../config/email.js";
import { AppointmentCancelledTemplate } from "../templates/emailTemplates.js";

const getLocalImageUrl = (req, imageFile) =>
  `${req.protocol}://${req.get("host")}/uploads/${imageFile.filename}`;

const uploadDoctorImage = async (req, imageFile) => {
  const isCloudinaryConfigured =
    process.env.CLOUDINARY_NAME &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_SECRET_KEY;

  if (!isCloudinaryConfigured) {
    return getLocalImageUrl(req, imageFile);
  }

  try {
    const imageUploader = await cloudinary.uploader.upload(imageFile.path, {
      resource_type: "image",
    });
    return imageUploader.secure_url;
  } catch (error) {
    console.warn("Cloudinary upload failed, using local image:", error.message);
    return getLocalImageUrl(req, imageFile);
  }
};

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

    const imageUrl = await uploadDoctorImage(req, imageFile);

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
      fees: Number(fees),
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
    if (
      email === process.env.ADMIN_EMAIL &&
      password === process.env.ADMIN_PASSWORD
    ) {
      const token = jwt.sign(email + password, process.env.JWT_SECRET);
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
    const doctors = await doctorModel.find({}).select("-password");
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

//api to get all doctor
const appointmentsadmin = async (req, res) => {
  try {
    const appointments = await appointmentModel.find({})
    res.json({success:true, appointments})
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
}
// API to delete doctor by id
const deleteDoctor = async (req, res) => {
  try {
    const { docId } = req.body;
    const doctor = await doctorModel.findByIdAndDelete(docId);
    if (!doctor) {
      return res.json({ success: false, message: "Doctor not found" });
    }
    res.json({ success: true, message: "Doctor deleted successfully" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API for admin to cancel appointment
const appointmentCancel = async (req, res) => {
  try {
    const { appointmentId } = req.body;
    const appointmentData = await appointmentModel.findById(appointmentId);

    if (!appointmentData) {
      return res.json({ success: false, message: "Appointment not found" });
    }

    await appointmentModel.findByIdAndUpdate(appointmentId, { cancelled: true });

    // Releasing doctor slot
    const { docId, slotDate, slotTime } = appointmentData;
    const doctorData = await doctorModel.findById(docId);
    if (doctorData) {
      let slots_booked = doctorData.slots_booked || {};
      if (Array.isArray(slots_booked[slotDate])) {
        slots_booked[slotDate] = slots_booked[slotDate].filter((e) => e !== slotTime);
        await doctorModel.findByIdAndUpdate(docId, { slots_booked });
      }
    }

    // Send cancellation email to patient
    sendNotificationEmail({
      to: appointmentData.userData?.email,
      subject: `Appointment Cancelled by Admin - Prescripto`,
      templateElement: React.createElement(AppointmentCancelledTemplate, {
        patientName: appointmentData.userData?.name,
        doctorName: appointmentData.docData?.name,
        slotDate: appointmentData.slotDate,
        slotTime: appointmentData.slotTime,
        cancelledBy: "Clinic Admin",
      }),
    });

    res.json({ success: true, message: "Appointment Cancelled" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export {
  addDoctor,
  loginAdmin,
  allDoctors,
  appointmentsadmin,
  deleteDoctor,
  appointmentCancel,
};
