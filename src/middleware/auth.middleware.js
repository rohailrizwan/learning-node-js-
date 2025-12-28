import jwt from "jsonwebtoken";
import { asyncHandler } from "../utils/asynchandler.js";
import ApiError from "../utils/apierror.js";
import { User } from "../models/user.model.js";



export const isAuthenticated = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new ApiError("Login required",401);
  }

  const token = authHeader.split(" ")[1];

  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  const user = await User.findById(decoded._id).select("-password");

  if (!user) {
    throw new ApiError("Invalid user",401);
  }

  req.user = user; // 👈 attach user
  next();
});
