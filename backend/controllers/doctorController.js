import doctorModel from "../models/doctorModel.js";

const changeAvailabilty = async (req, res) => {
  try {
    const { docId } = req.body;
    const docData = await doctorModel.findById(docId);
    await doctorModel.findByIdAndUpdate(docId, {
      available: !docData.available,
    });
    res.json({
      success: true,
      message: "Doctor availability changed successfully",
      data: docData,
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message }); 
  }
};

const doctorList = async (req, res) => {
  try {
    const doctors = await doctorModel.find({}).select(["-password", "-email"]);
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

export { changeAvailabilty, doctorList };
