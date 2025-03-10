import { Request, Response } from "express";
import { ILoginRequest, ILoginResponse } from "../interfaces/IAuthInterfaces";
import jwt from "jsonwebtoken";
import authService from "../service/authService";
import documentService from "../service/documentService";
import { DocumentType } from "../interfaces/IDocumentInterfaces";
import { sendEmailWithTemplate } from "../service/emailService";
import clientService from "../service/clientService";
import providerService from "../service/providerService";

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

  generateUploadToken: async (req: Request, res: Response) => {
    const ownerId = req.body.ownerId;
    const ownerType = req.body.ownerType;

    let documentResponse = {
      success: false,
      message: "Internal server error",
      token: "",
    };

    if (!ownerId || !ownerType) {
      documentResponse.message =
        "Bad request. Owner ID and owner type are required";
      res.status(400).json(documentResponse);
      return;
    }

    try {
      const token = await authService.generateUploadToken(ownerType, +ownerId);

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
      documentResponse.message = "Token generated successfully";
      documentResponse.token = token;

      let emailSent = false;
      if (ownerType.toLowerCase() === "client") {
        const client = await clientService.getClientById(ownerId);
        if (client) {
          emailSent = await sendEmailWithTemplate(
            client.email,
            client.name,
            `${process.env.CLIENT_UPLOAD}/upload?token=${token}`
          );
        }
      } else {
        const provider = await providerService.getProviderById(ownerId);
        if (provider) {
          emailSent = await sendEmailWithTemplate(
            provider.email,
            provider.name,
            `${process.env.CLIENT_UPLOAD}/upload?token=${token}`
          );
        }
      }

      if (!emailSent) {
        documentResponse.message = "Failed to send email";
        res.status(500).json(documentResponse);
        return;
      }

      res.status(200).json(documentResponse);
    } catch (error) {
      console.error("Generate token error:", error);
      res.status(500).json(documentResponse);
    }
  },

  validateUploadToken: async (req: Request, res: Response) => {
    const token = req.body.token;

    let validateResponse = {
      success: false,
      message: "Internal server error",
      ownerType: "",
      ownerId: 0,
      ownerData: {},
      documents: {},
    };

    if (!token) {
      validateResponse.message = "Bad request. Token is required";
      res.status(400).json(validateResponse);
      return;
    }

    try {
      const payload = await authService.decryptUploadToken(token);

      const documents =
        await documentService.getCurrentRequestedDocumentsByOwner(
          payload.ownerType,
          payload.ownerId
        );

      if (documents.length === 0) {
        validateResponse.message = "No documents found";
        res.status(404).json(validateResponse);
        return;
      }

      validateResponse.documents = documents;

      if (payload.ownerType.toLowerCase() === "client") {
        const client = await clientService.getClientById(payload.ownerId);
        if (client) {
          validateResponse.ownerType = "Client";
          validateResponse.ownerId = client.id;
          validateResponse.ownerData = client;
        }
      } else {
        const provider = await providerService.getProviderById(payload.ownerId);
        if (provider) {
          validateResponse.ownerType = "Provider";
          validateResponse.ownerId = provider.id;
          validateResponse.ownerData = provider;
        }
      }

      validateResponse.success = true;
      validateResponse.message = "Token was validated successfully";
      res.status(200).json(validateResponse);
    } catch (error) {
      console.error("Validate token error:", error);
      res.status(500).json("Internal server error");
    }
  },
};

export default authController;
