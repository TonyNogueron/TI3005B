import { Router } from "express";
import { upload } from "../middlewares/multer";
import documentController from "../controllers/document.controller";
import middleware from "../middlewares/jwt-middleware";
const documentRouter = Router();

documentRouter.post(
  "/upload-multiple",
  upload.array("files", 10),
  documentController.uploadMultipleDocuments
);

documentRouter.post(
  "/requestDocuments",
  middleware,
  documentController.requestNewDocuments
);

documentRouter.get("/", middleware, documentController.getAllDocuments);

documentRouter.get(
  "/pending",
  middleware,
  documentController.getCurrentPendingDocuments
);

documentRouter.get(
  "/valid",
  middleware,
  documentController.getCurrentValidDocuments
);

documentRouter.get(
  "/rejected",
  middleware,
  documentController.getCurrentRejectedDocuments
);

documentRouter.get(
  "/client",
  middleware,
  documentController.getCurrentDocumentsByClientName
);

documentRouter.get(
  "/provider",
  middleware,
  documentController.getCurrentDocumentsByProviderName
);

documentRouter.put(
  "/validate",
  middleware,
  documentController.validateDocument
);

documentRouter.put("/reject", middleware, documentController.rejectDocument);

export default documentRouter;
