import { Request, Response } from "express";
import GoogleDrive from "../google-drive/drive";
import { FileUpload } from "../interfaces/IGoogleDriveInterfaces";
import {
  IDocumentResponse,
  numToMonth,
} from "../interfaces/IDocumentInterfaces";

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

      const files: FileUpload[] = req.files.map((file: any) => {
        return {
          name: file.originalname,
          type: file.mimetype,
          data: file.buffer,
        };
      });

      const { ownerType, name: clientName } = req.body;

      if (!ownerType || !clientName) {
        documentResponse.message =
          "Bad request. Client name and owner type are required";
        res.status(400).json(documentResponse);
        return;
      }

      // Get year and month from current date
      const currentDate = new Date();
      const year = currentDate.getFullYear().toString();
      const month = numToMonth(currentDate.getMonth() + 1);

      // Upload files to Google Drive
      const uploadedFiles = await GoogleDrive.uploadFile(
        files,
        clientName,
        ownerType,
        month,
        year,
        process.env.GOOGLE_DRIVE_ROOT_FOLDER_ID as string
      );

      if (uploadedFiles) {
        documentResponse.success = true;
        documentResponse.message = "Files uploaded successfully";
        documentResponse.data = uploadedFiles;
        res.status(200).json(documentResponse);
      } else {
        documentResponse.message = "Failed to upload files";
        res.status(500).json(documentResponse);
      }
    } catch (error) {
      console.error("File upload error:", error);
      documentResponse.message = "Internal server error";
      res.status(500).json(documentResponse);
    }
  },
};

export default documentController;
