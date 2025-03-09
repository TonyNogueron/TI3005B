import { Router } from "express";
import { upload } from "../middlewares/multer";
import documentController from "../controllers/document.controller";

const documentRouter = Router();

documentRouter.post(
  "/upload-multiple",
  upload.array("files", 10),
  documentController.uploadMultipleDocuments
);

documentRouter.post(
  "/requestDocuments",
  documentController.requestNewDocuments
);

documentRouter.get("/", documentController.getAllDocuments);

documentRouter.get(
  "/pending",
  documentController.getCurrentPendingDocuments
);

documentRouter.get(
  "/valid",
  documentController.getCurrentValidDocuments
);

documentRouter.get(
  "/rejected",
  documentController.getCurrentRejectedDocuments
);

documentRouter.get(
  "/client",
  documentController.getCurrentDocumentsByClientName
);

documentRouter.get(
  "/provider",
  documentController.getCurrentDocumentsByProviderName
);

documentRouter.put("/validate", documentController.validateDocument);

documentRouter.put("/reject", documentController.rejectDocument);

export default documentRouter;
