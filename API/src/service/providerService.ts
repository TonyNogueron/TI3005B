import pool from "../config/dbconfig";
import { Provider } from "../interfaces/IProviderInterfaces";
import { RowDataPacket, ResultSetHeader } from "mysql2";
import documentService from "./documentService";
import { DocumentOwnerType } from "../interfaces/IGoogleDriveInterfaces";
import { DocumentStatus } from "../interfaces/IDocumentInterfaces";

const providerService = {
  getAllProviders: async (): Promise<Provider[]> => {
    const connection = await pool.getConnection();
    const [rows] = await connection.query<RowDataPacket[]>(
      "SELECT * FROM Provider"
    );
    connection.release();
    return rows as Provider[];
  },

  getProviderById: async (id: number): Promise<Provider | null> => {
    const connection = await pool.getConnection();
    const [rows] = await connection.query<RowDataPacket[]>(
      "SELECT * FROM Provider WHERE id = ?",
      [id]
    );
    connection.release();

    if (rows.length > 0) {
      return rows[0] as Provider;
    } else {
      return null;
    }
  },

  createProvider: async (provider: Provider): Promise<number> => {
    const connection = await pool.getConnection();
    const [result] = await connection.query<ResultSetHeader>(
      "INSERT INTO Provider (name, vendorId, email, phoneNumber, documentsStatus, isActive) VALUES (?, ?, ?, ?, ?, ?)",
      [
        provider.name,
        provider.vendorId,
        provider.email,
        provider.phoneNumber,
        provider.documentsStatus,
        provider.isActive,
      ]
    );
    connection.release();

    return result.insertId;
  },

  updateProvider: async (provider: Provider): Promise<boolean> => {
    const connection = await pool.getConnection();
    const [result] = await connection.query<ResultSetHeader>(
      "UPDATE Provider SET name = ?, vendorId = ?, email = ?, phoneNumber = ?, documentsStatus = ?, isActive = ? WHERE id = ?",
      [
        provider.name,
        provider.vendorId,
        provider.email,
        provider.phoneNumber,
        provider.documentsStatus,
        provider.isActive,
        provider.id,
      ]
    );
    connection.release();

    return result.affectedRows > 0;
  },

  deleteProvider: async (id: number): Promise<boolean> => {
    const connection = await pool.getConnection();
    const [result] = await connection.query<ResultSetHeader>(
      "DELETE FROM Provider WHERE id = ?",
      [id]
    );
    connection.release();

    return result.affectedRows > 0;
  },

  updateProviderStatus: async (
    id: number,
    status: string
  ): Promise<boolean> => {
    const connection = await pool.getConnection();
    const [result] = await connection.query<ResultSetHeader>(
      "UPDATE Provider SET documentsStatus = ? WHERE id = ?",
      [status, id]
    );
    connection.release();

    return result.affectedRows > 0;
  },

  validateAndUpdateProviderStatus: async (id: number): Promise<boolean> => {
    try {
      const providerDocuments =
        await documentService.getThisMonthDocumentsByOwner(
          DocumentOwnerType.PROVIDER,
          id
        );

      // Filter out documents with status "EN_ESPERA" or "SIN_ENTREGA"
      const filteredDocuments = providerDocuments.filter(
        (doc) =>
          doc.validStatus !== DocumentStatus.EN_ESPERA &&
          doc.validStatus !== DocumentStatus.SIN_ENTREGA
      );

      if (filteredDocuments.length === 0) {
        // No relevant documents found
        return false;
      }

      const hasRejectedDocument = filteredDocuments.some(
        (doc) => doc.validStatus === DocumentStatus.RECHAZADO
      );

      if (hasRejectedDocument) {
        // at least 1 is rejected
        await providerService.updateProviderStatus(
          id,
          DocumentStatus.RECHAZADO
        );
        return true;
      }

      const allDocumentsAccepted = filteredDocuments.every(
        (doc) => doc.validStatus === DocumentStatus.ACEPTADO
      );

      if (allDocumentsAccepted) {
        await providerService.updateProviderStatus(id, DocumentStatus.ACEPTADO);
        return true;
      }

      // If some documents are accepted and some are pending
      await providerService.updateProviderStatus(
        id,
        DocumentStatus.POR_VALIDAR
      );
      return true;
    } catch (error) {
      console.error("Error validating and updating client status:", error);
      throw error;
    }
  },
};

export default providerService;
