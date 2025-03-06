import { Request, Response } from "express";
import { ILoginRequest, ILoginResponse } from "../interfaces/IAuthInterfaces";
import jwt from "jsonwebtoken";
import authService from "../service/authService";

const authController = {
  login: async (req: Request, res: Response) => {
    const loginRequest: ILoginRequest = req.body;

    let loginResponse: ILoginResponse = {
      success: false,
      message: "Bad request. Email and password are required",
      token: null,
      expiresIn: null,
    };

    if (!loginRequest.email || !loginRequest.password) {
      res.status(400).json(loginResponse);
      return;
    }

    try {
      const user = await authService.getUserByEmailAndPassword(
        loginRequest.email,
        loginRequest.password
      );
      
      if (user) {
        const payload = { email: loginRequest.email, id: user.id };
        const token = jwt.sign(payload, process.env.JWT_SECRET as string, {
          expiresIn: "1h",
        });

        loginResponse.success = true;
        loginResponse.message = "Login successful";
        loginResponse.token = token;
        loginResponse.expiresIn = 3600;

        res.status(200).json(loginResponse);
      } else {
        loginResponse.message = "Invalid email or password";
        res.status(401).json(loginResponse);
      }
    } catch (error) {
      console.error("Login error:", error);
      loginResponse.message = "Internal server error";
      res.status(500).json(loginResponse);
    }
  },
};

export default authController;
