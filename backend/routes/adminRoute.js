import express from "express";
import { addDoctor, allDoctors, loginAdmin } from "../controllers/adminController.js";
import upload from "../middlewares/multer.js";
import authAdmin from "../middlewares/authAdmin.js";
import { changeAvailabilty } from "../controllers/doctorController.js";

const adminRouter = express.Router();

// Route to add a doctor with image upload
adminRouter.post("/add-doctor", authAdmin, upload.single("image"), addDoctor);
adminRouter.post("/login", loginAdmin);
adminRouter.post("/all-doctors", authAdmin ,allDoctors);
adminRouter.post("/change-Availabilty", authAdmin ,changeAvailabilty);

export default adminRouter;