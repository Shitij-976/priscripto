import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";
import { v2 as cloudinary } from "cloudinary";
import doctorModel from "../models/doctorModel.js";
import appointmentModel from "../models/appointmentModel.js";
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Missing details" });
    }
    if (!validator.isEmail(email)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid email format" });
    }
    if (password.length < 8) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Password must be at least 8 characters long",
        });
    }
    // hashing user password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const userData = {
      name,
      email,
      password: hashedPassword,
    };
    const newUser = new userModel(userData);
    const user = await newUser.save();

    //create token for user login
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    res.json({
      success: true,
      message: "User registered successfully",
      password: hashedPassword,
      token,
      user: {
        name: user.name,
        email: user.email,
        id: user._id,
      },
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};
// api for user login
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User not found" });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (isPasswordValid) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
      res.json({
        success: true,
        message: "User login successfully",
        token,
        user: {
          name: user.name,
          email: user.email,
          id: user._id,
        },
      });
    } else {
      //invalid crendtials
      res.json({
        success: false,
        message: "Invalid email or password",
      });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

//api for user profile

const getProfile = async (req, res) => {
  try {
    const { userId } = req.body;
    const userData = await userModel.findById(userId).select("-password");
    res.json({
      success: true,
      message: "User profile fetched successfully",
      userData,
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};
//update user profile
const updateProfile = async (req, res) => {
  try {
    const { userId, name, phone, address, dob, gender } = req.body;
    const imageFile = req.file ? req.file.path : null;
    if (!name || !phone || !dob || !gender) {
      return res
        .status(400)
        .json({ success: false, message: "Missing details" });
    }
    await userModel.findByIdAndUpdate(userId, {
      name,
      phone,
      address: JSON.parse(address), // Fixed JSON.parse
      dob,
      gender,
    });
    if (imageFile) {
      //upload image to cloudinary
      const imageUploader = await cloudinary.uploader.upload(imageFile, {
        resource_type: "image",
      });
      const imageURL = imageUploader.secure_url;
      await userModel.findByIdAndUpdate(userId, {
        image: imageURL,
      });
    }
    res.json({
      success: true,
      message: " Profile updated successfully",
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};


//API to book Appointment
const bookAppointment = async (req, res) => {
  try {
      const { userId, docId, slotDate, slotTime } = req.body

      // Check if the user already has an appointment at the same slot
      const existingAppointment = await appointmentModel.findOne({ userId, slotDate, slotTime, cancelled: false })
      if (existingAppointment) {
          return res.json({ success: false, message: "You already have an appointment booked at this time" });
      }

      const docData = await doctorModel.findById(docId).select("-password")
      if (!docData.available) {
          return res.json({ success: false, message: "Doctor not available" })
      }
      let slots_booked = docData.slots_booked
      // checking for slot available
      if (slots_booked[slotDate]) {
          if (slots_booked[slotDate].includes(slotTime)) {
              return res.json({ success: false, message: "Slot not available" })
          } else {
              slots_booked[slotDate].push(slotTime)
          }
      } else {
          slots_booked[slotDate] = []
          slots_booked[slotDate].push(slotTime)
      }

      const userData = await userModel.findById(userId).select("-password")
      delete docData.slots_booked
      const appointmentData = {
          userId,
          docId,
          userData,
          docData,
          amount: docData.fees,
          slotTime,
          slotDate,
          date: Date.now()
      }
      const newappointment = new appointmentModel(appointmentData)
      await newappointment.save()
      // save new slot data in docData
      await doctorModel.findByIdAndUpdate(docId, { slots_booked })
      res.json({ success: true, message: "Appointment booked" })
  } catch (error) {
      console.log(error);
      res.json({ success: false, message: error.message });
  }
}
export { registerUser, loginUser, getProfile, updateProfile,bookAppointment};
