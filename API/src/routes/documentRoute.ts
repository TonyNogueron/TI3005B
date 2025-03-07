import { Router } from "express";
import { upload } from "../middlewares/multer";
import documentController from "../controllers/document.controller";

const documentRouter = Router();

documentRouter.post(
  "/upload-multiple",
  upload.array("files", 10),
  documentController.uploadMultipleDocuments
);

export default documentRouter;
