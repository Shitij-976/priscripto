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
    console.log({
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

    // Debugging: Check if the file is being received
    if (!imageFile) {
      console.error("No file received");
      return res.status(400).json({ message: "Image file is required" });
    }

    console.log("File received:", imageFile);

    // Example response (replace with actual database logic)
    res
      .status(201)
      .json({ message: "Doctor added successfully", data: req.body });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export { addDoctor };
