import { Router } from "express";
import authController from "../controllers/auth.controller";

const authRouter = Router();

authRouter.post("/login", authController.login);

authRouter.post("/uploadRequest", authController.generateUploadToken);

authRouter.post("/validateToken", authController.validateUploadToken);

export default authRouter;
