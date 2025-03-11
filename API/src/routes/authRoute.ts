import { Router } from "express";
import authController from "../controllers/auth.controller";
import middleware from "../middlewares/jwt-middleware";

const authRouter = Router();

authRouter.post("/login", authController.login);

authRouter.post(
  "/uploadRequest",
  middleware,
  authController.generateUploadToken
);

authRouter.post(
  "/validateToken",
  middleware,
  authController.validateUploadToken
);

export default authRouter;
