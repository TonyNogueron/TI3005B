import express, { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const middleware = express.Router();

middleware.use((req: Request, res: Response, next: NextFunction): void => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      res.status(403).json({ message: "Missing Token" });
      return;
    }

    jwt.verify(token, process.env.JWT_SECRET as string, (err, decoded) => {
      if (err) {
        console.error("Token verification error:", err);
        res.status(403).json({ message: "Invalid Token" });
        return;
      }
      next();
    });
  } catch (error) {
    console.error("Unexpected error in token verification:", error);
    res.status(500).json({ message: "Internal server error" });
    return;
  }
});

export default middleware;
