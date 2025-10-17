import ApiError from "../utils/apierror.js";


export const errorMiddleware = (err, req, res, next) => {
  console.log("❌ Error caught:", err);

  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: err.success,
      message: err.message,
      errors: err.errors,
    });
  }

  return res.status(500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
};
