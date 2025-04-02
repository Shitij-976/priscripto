import jwt from "jsonwebtoken";

const authAdmin = (req, res, next) => {
  try {
    const { atoken } = req.headers;
    if (!atoken) {
      return res.status(401).json({
        success: false,
        message: "Not authorized, Login Agin",
      });
    }
    const token_decode = jwt.verify(atoken, process.env.JWT_SECRET);
    if (token_decode !== process.env.ADMIN_EMAIL + process.env.ADMIN_PASSWORD) {
      return res.status(401).json({
        success: false,
        message: "Not authorized, token not valid",
      });
    }

    next();
  } catch (error) {
    console.error("Error occurred:", error);
    res.json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};
export default authAdmin;