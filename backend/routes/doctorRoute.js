import express from 'express';
import {
  doctorList,
  loginDoctor,
  appointmentsDoctor,
  appointmentCancel,
  appointmentComplete,
  doctorDashboard,
  changeAvailabilty,
  doctorProfile,
  updateDoctorProfile,
} from '../controllers/doctorController.js';
import authDoctor from '../middlewares/authDoctor.js';
import upload from '../middlewares/multer.js';

const doctorRouter = express.Router();

doctorRouter.post('/login', loginDoctor);
doctorRouter.get('/list', doctorList);
doctorRouter.get('/appointments', authDoctor, appointmentsDoctor);
doctorRouter.post('/cancel-appointment', authDoctor, appointmentCancel);
doctorRouter.post('/complete-appointment', authDoctor, appointmentComplete);
doctorRouter.get('/dashboard', authDoctor, doctorDashboard);
doctorRouter.post('/change-availability', authDoctor, changeAvailabilty);
doctorRouter.get('/profile', authDoctor, doctorProfile);
doctorRouter.post('/update-profile', upload.single('image'), authDoctor, updateDoctorProfile);

export default doctorRouter;
