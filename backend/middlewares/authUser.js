import jwt from "jsonwebtoken";
//user authentication middleware
const authUser = (req, res, next) => {
  try {
    const { token } = req.headers;
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Not authorized, Login Again",
      });
    }
    const token_decode = jwt.verify(token, process.env.JWT_SECRET);
    req.body.userId = token_decode.id;

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
export default authUser;
// if (token_decode !== process.env.ADMIN_EMAIL + process.env.ADMIN_PASSWORD) {
//   return res.status(401).json({
//     success: false,
//     message: "Not authorized, token not valid",
//   });
// }
