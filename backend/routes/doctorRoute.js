import express from 'express';
import {
  doctorList,
  loginDoctor,
  appointmentsDoctor,
  appointmentCancel,
  appointmentComplete,
  doctorDashboard,
  changeAvailabilty,
} from '../controllers/doctorController.js';
import authDoctor from '../middlewares/authDoctor.js';

const doctorRouter = express.Router();

doctorRouter.post('/login', loginDoctor);
doctorRouter.get('/list', doctorList);
doctorRouter.get('/appointments', authDoctor, appointmentsDoctor);
doctorRouter.post('/cancel-appointment', authDoctor, appointmentCancel);
doctorRouter.post('/complete-appointment', authDoctor, appointmentComplete);
doctorRouter.get('/dashboard', authDoctor, doctorDashboard);
doctorRouter.post('/change-availability', authDoctor, changeAvailabilty);

export default doctorRouter;
