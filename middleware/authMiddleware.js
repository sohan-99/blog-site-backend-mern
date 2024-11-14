import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const authGuard = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith("Bearer")) {
    try {
      // Extract the token from the "Bearer <token>" format
      const token = authHeader.split(" ")[1];

      // Verify token and extract user ID
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Fetch user and attach it to the request object without the password
      req.user = await User.findById(decoded.id).select("-password");

      if (!req.user) {
        const error = new Error("User not found, authorization failed");
        error.statusCode = 401;
        return next(error);
      }

      next();
    } catch (error) {
      // Handle specific JWT errors for better debugging
      const jwtError = new Error("Not authorized, token failed");
      jwtError.statusCode = 401;
      next(jwtError);
    }
  } else {
    const error = new Error("Not authorized, no token provided");
    error.statusCode = 401;
    next(error);
  }
};

export const adminGuard = (req, res, next) => {
  if (req.user && req.user.admin) {
    next();
  } else {
    const error = new Error("Not authorized as an admin");
    error.statusCode = 401;
    next(error);
  }
};
