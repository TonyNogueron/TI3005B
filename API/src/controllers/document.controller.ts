import { Request, Response } from "express";
import GoogleDrive from "../google-drive/drive";
import { FileUpload } from "../interfaces/IGoogleDriveInterfaces";
import {
  DocumentType,
  IDocumentResponse,
  numToMonth,
  OwnerType,
} from "../interfaces/IDocumentInterfaces";
import documentService from "../service/documentService";
import clientService from "../service/clientService";
import providerService from "../service/providerService";

const documentController = {
  uploadMultipleDocuments: async (
    req: Request,
    res: Response
  ): Promise<void> => {
    let documentResponse: IDocumentResponse = {
      success: false,
      message: "Bad request. No file uploaded",
    };

    try {
      if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
        res.status(400).json(documentResponse);
        return;
      }

      let metadata: any[] = [];
      try {
        metadata = JSON.parse(req.body.metadata || "[]");
      } catch (error) {
        documentResponse.message = "Invalid metadata format";
        res.status(400).json(documentResponse);
        return;
      }

      const files: FileUpload[] = req.files.map((file: any) => {
        const fileMetadata = metadata.find(
          (m: any) => m.filename === file.originalname
        );
        return {
          name: file.originalname,
          type: file.mimetype,
          data: file.buffer,
          documentType:
            fileMetadata?.documentType ||
            DocumentType.CONSTANCIA_DE_SITUACION_FISCAL,
        };
      });

      const { ownerType, ownerId } = req.body;

      if (!ownerType || !ownerId) {
        documentResponse.message =
          "Bad request. Owner id and owner type are required";
        res.status(400).json(documentResponse);
        return;
      }

      if (ownerType !== "Client" && ownerType !== "Provider") {
        documentResponse.message = "Bad request. Invalid owner type";
        res.status(400).json(documentResponse);
        return;
      }

      let clientName = "";
      const currentDate = new Date();
      const year = currentDate.getFullYear().toString();
      const month = numToMonth(currentDate.getMonth() + 1);

      if (ownerType === OwnerType.CLIENT) {
        const client = await clientService.getClientById(ownerId);
        if (!client) {
          documentResponse.message = "Client not found";
          res.status(404).json(documentResponse);
          return;
        }
        clientName = client.name;
      } else {
        const provider = await providerService.getProviderById(ownerId);
        if (!provider) {
          documentResponse.message = "Provider not found";
          res.status(404).json(documentResponse);
          return;
        }
        clientName = provider.name;
      }

      const clientDocuments =
        await documentService.getCurrentRequestedDocumentsByOwner(
          ownerType,
          ownerId
        );

      if (!Array.isArray(clientDocuments) || clientDocuments.length === 0) {
        documentResponse.message = "No pending documents found";
        res.status(404).json(documentResponse);
        return;
      }

      // Upload files to Google Drive
      const uploadedFiles = await GoogleDrive.uploadFile(
        files,
        clientName,
        ownerType,
        month,
        year,
        process.env.GOOGLE_DRIVE_ROOT_FOLDER_ID as string
      );

      if (!uploadedFiles || uploadedFiles.length === 0) {
        documentResponse.message = "Failed to upload files";
        res.status(500).json(documentResponse);
        return;
      }

      // Update document records in the database
      let failedUpdates: string[] = [];
      for (const file of uploadedFiles) {
        const clientDocument = clientDocuments.find(
          (doc) => doc.documentType === file.documentType
        );

        const docUpdate = await documentService.updateUploadedDocument(
          clientDocument?.id || 0,
          file.name,
          file.documentType!,
          file.webViewLink!
        );

        if (!docUpdate) {
          failedUpdates.push(file.name);
        }
      }

      if (failedUpdates.length > 0) {
        documentResponse.message = `Some files uploaded, but failed to update records: ${failedUpdates.join(
          ", "
        )}`;
        res.status(207).json(documentResponse);
      } else {
        documentResponse.success = true;
        documentResponse.message = "Files uploaded successfully";
        documentResponse.data = uploadedFiles;
        res.status(200).json(documentResponse);
      }
    } catch (error) {
      console.error("File upload error:", error);
      documentResponse.message = "Internal server error";
      res.status(500).json(documentResponse);
    }
  },

  requestNewDocuments: async (req: Request, res: Response): Promise<void> => {
    let documentResponse: IDocumentResponse = {
      success: false,
      message: "Bad request. Owner id and owner type are required",
    };

    const { ownerType, ownerId } = req.body;

    if (!ownerType || !ownerId) {
      res.status(400).json(documentResponse);
      return;
    }

    if (ownerType !== "Client" && ownerType !== "Provider") {
      documentResponse.message = "Bad request. Invalid owner type";
      res.status(400).json(documentResponse);
      return;
    }

    const documentCreation = await documentService.createInitialDocument(
      ownerType,
      ownerId,
      DocumentType.CONSTANCIA_DE_SITUACION_FISCAL
    );

    const documentCreation2 = await documentService.createInitialDocument(
      ownerType,
      ownerId,
      DocumentType.OPINION_DE_CUMPLIMIENTO
    );

    if (!documentCreation || !documentCreation2) {
      documentResponse.message = "Failed to create document";
      res.status(500).json(documentResponse);
      return;
    }

    documentResponse.success = true;
    documentResponse.message = "Document creation successful";
    res.status(200).json(documentResponse);
  },
};

export default documentController;
