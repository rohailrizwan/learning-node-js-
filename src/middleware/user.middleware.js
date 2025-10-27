import { user } from "../Models/user.model.js";
import ApiError from "../utils/apierror.js";
import { asyncHandler } from "../utils/asynchandler.js";
import jwt from "jsonwebtoken";

const verifyJwt = asyncHandler(async (req, res, next) => {
  try {
    // 1️⃣ Get token from cookies or header
    const accessToken =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", ""); // ← added space after Bearer

    if (!accessToken) {
      throw new ApiError("Unauthorized: Token missing", 401);
    }

    // 2️⃣ Verify token
    let decodeToken;
    try {
      decodeToken = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
    } catch (err) {
      throw new ApiError("Invalid or expired token", 401);
    }

    // 3️⃣ Find user in DB
    const findUser = await user
      .findById(decodeToken?._id)
      .select("-password -refreshToken");

    if (!findUser) {
      throw new ApiError("User not found", 404);
    }

    // 4️⃣ Attach user to request
    req.user = findUser;
    next();
  } catch (error) {
    console.error("JWT Verification Error:", error.message);

    // If error is an instance of ApiError → use its status/message
    if (error instanceof ApiError) {
      return res.status(error.statusCode).json({
        success: false,
        message: error.message,
        ...(error.errors && { errors: error.errors }), // include validation errors if any
      });
    }

    // Otherwise, send a generic 500 response
    return res.status(500).json({
      success: false,
      message: "Internal Server Error during token verification",
    });
  }
});

export default verifyJwt;
