import { Request, Response } from "express";
import jwt from "jsonwebtoken";

const authController = {
  login: (req: Request, res: Response) => {
    const { username, password } = req.body;
    if (username === "admin" && password === "admin") {
      const token = jwt.sign({ username }, process.env.SECRET_KEY as string, {
        expiresIn: "1h",
      });
      res.status(200).json({ token });
    } else {
      res.status(401).json({ message: "Invalid username or password" });
    }
  },
};

export default authController;
