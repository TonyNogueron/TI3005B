import { Request, Response } from "express";
import { DocumentStatus } from "../interfaces/IDocumentInterfaces";
import { IClientDocumentsResponse } from "../interfaces/IClientInterfaces";
import dashboardService from "../service/dashboardService";
import { IProviderDocumentsResponse } from "../interfaces/IProviderInterfaces";

const dashboardController = {
  getClientsPendingDocuments: async (req: Request, res: Response) => {
    let documentResponse: IClientDocumentsResponse = {
      success: false,
      message: "No pending documents found",
      clients: [],
    };
    try {
      const clients = await dashboardService.getClientDocumentsByStatusArray([
        DocumentStatus.POR_VALIDAR,
        DocumentStatus.RECHAZADO,
        DocumentStatus.SIN_ENTREGA,
      ]);

      if (clients.length === 0) {
        res.status(404).json(documentResponse);
        return;
      }

      documentResponse.success = true;
      documentResponse.message = "Pending documents found";
      documentResponse.clients = clients;
      res.status(200).json(documentResponse);
    } catch (error) {
      console.error("Error listing documents:", error);
      documentResponse.message = "Internal server error";
      res.status(500).json(documentResponse);
    }
  },
  getClientsValidDocuments: async (req: Request, res: Response) => {
    let documentResponse: IClientDocumentsResponse = {
      success: false,
      message: "No valid documents found",
      clients: [],
    };
    try {
      const clients = await dashboardService.getClientDocumentsByStatusArray([
        DocumentStatus.ACEPTADO,
      ]);

      if (clients.length === 0) {
        res.status(404).json(documentResponse);
        return;
      }

      documentResponse.success = true;
      documentResponse.message = "Valid documents found";
      documentResponse.clients = clients;
      res.status(200).json(documentResponse);
    } catch (error) {
      console.error("Error listing documents:", error);
      documentResponse.message = "Internal server error";
      res.status(500).json(documentResponse);
    }
  },
  getClientsRejectedDocuments: async (req: Request, res: Response) => {
    let documentResponse: IClientDocumentsResponse = {
      success: false,
      message: "No rejected documents found",
      clients: [],
    };
    try {
      const clients = await dashboardService.getClientDocumentsByStatusArray([
        DocumentStatus.RECHAZADO,
      ]);

      if (clients.length === 0) {
        res.status(404).json(documentResponse);
        return;
      }

      documentResponse.success = true;
      documentResponse.message = "Rejected documents found";
      documentResponse.clients = clients;
      res.status(200).json(documentResponse);
    } catch (error) {
      console.error("Error listing documents:", error);
      documentResponse.message = "Internal server error";
      res.status(500).json(documentResponse);
    }
  },

  getProvidersPendingDocuments: async (req: Request, res: Response) => {
    let documentResponse: IProviderDocumentsResponse = {
      success: false,
      message: "No pending documents found",
      providers: [],
    };
    try {
      const providers =
        await dashboardService.getProvidersDocumentsByStatusArray([
          DocumentStatus.POR_VALIDAR,
          DocumentStatus.RECHAZADO,
          DocumentStatus.SIN_ENTREGA,
        ]);

      if (providers.length === 0) {
        res.status(404).json(documentResponse);
        return;
      }

      documentResponse.success = true;
      documentResponse.message = "Pending documents found";
      documentResponse.providers = providers;
      res.status(200).json(documentResponse);
    } catch (error) {
      console.error("Error listing documents:", error);
      documentResponse.message = "Internal server error";
      res.status(500).json(documentResponse);
    }
  },

  getProvidersValidDocuments: async (req: Request, res: Response) => {
    let documentResponse: IProviderDocumentsResponse = {
      success: false,
      message: "No valid documents found",
      providers: [],
    };
    try {
      const providers =
        await dashboardService.getProvidersDocumentsByStatusArray([
          DocumentStatus.ACEPTADO,
        ]);

      if (providers.length === 0) {
        res.status(404).json(documentResponse);
        return;
      }

      documentResponse.success = true;
      documentResponse.message = "Approved documents found";
      documentResponse.providers = providers;
      res.status(200).json(documentResponse);
    } catch (error) {
      console.error("Error listing documents:", error);
      documentResponse.message = "Internal server error";
      res.status(500).json(documentResponse);
    }
  },

  getProvidersRejectedDocuments: async (req: Request, res: Response) => {
    let documentResponse: IProviderDocumentsResponse = {
      success: false,
      message: "No rejected documents found",
      providers: [],
    };
    try {
      const providers =
        await dashboardService.getProvidersDocumentsByStatusArray([
          DocumentStatus.RECHAZADO,
        ]);

      if (providers.length === 0) {
        res.status(404).json(documentResponse);
        return;
      }

      documentResponse.success = true;
      documentResponse.message = "Rejected documents found";
      documentResponse.providers = providers;
      res.status(200).json(documentResponse);
    } catch (error) {
      console.error("Error listing documents:", error);
      documentResponse.message = "Internal server error";
      res.status(500).json(documentResponse);
    }
  },
};

export default dashboardController;
