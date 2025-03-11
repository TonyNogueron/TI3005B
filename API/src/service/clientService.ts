import pool from "../config/dbconfig";
import { Client } from "../interfaces/IClientInterfaces";
import { RowDataPacket, ResultSetHeader } from "mysql2";
import documentService from "./documentService";
import { DocumentOwnerType } from "../interfaces/IGoogleDriveInterfaces";
import { DocumentStatus } from "../interfaces/IDocumentInterfaces";

const clientService = {
  getAllClients: async (): Promise<Client[]> => {
    const connection = await pool.getConnection();
    const [rows] = await connection.query<RowDataPacket[]>(
      "SELECT * FROM Client"
    );
    connection.release();
    return rows as Client[];
  },

  getClientById: async (id: number): Promise<Client | null> => {
    const connection = await pool.getConnection();
    const [rows] = await connection.query<RowDataPacket[]>(
      "SELECT * FROM Client WHERE id = ?",
      [id]
    );
    connection.release();

    if (rows.length > 0) {
      return rows[0] as Client;
    } else {
      return null;
    }
  },

  createClient: async (client: Client): Promise<number> => {
    const connection = await pool.getConnection();
    const [result] = await connection.query<ResultSetHeader>(
      "INSERT INTO Client (name, vendorId, email, phoneNumber, documentsStatus, isActive) VALUES (?, ?, ?, ?, ?, ?)",
      [
        client.name,
        client.vendorId,
        client.email,
        client.phoneNumber,
        client.documentsStatus,
        client.isActive,
      ]
    );
    connection.release();

    return result.insertId;
  },

  updateClient: async (client: Client): Promise<boolean> => {
    const connection = await pool.getConnection();
    const [result] = await connection.query<ResultSetHeader>(
      "UPDATE Client SET name = ?, vendorId = ?, email = ?, phoneNumber = ?, documentsStatus = ?, isActive = ? WHERE id = ?",
      [
        client.name,
        client.vendorId,
        client.email,
        client.phoneNumber,
        client.documentsStatus,
        client.isActive,
        client.id,
      ]
    );
    connection.release();

    return result.affectedRows > 0;
  },

  deleteClient: async (id: number): Promise<boolean> => {
    const connection = await pool.getConnection();
    const [result] = await connection.query<ResultSetHeader>(
      "DELETE FROM Client WHERE id = ?",
      [id]
    );
    connection.release();

    return result.affectedRows > 0;
  },

  updateClientStatus: async (id: number, status: string): Promise<boolean> => {
    const connection = await pool.getConnection();
    const [result] = await connection.query<ResultSetHeader>(
      "UPDATE Client SET documentsStatus = ? WHERE id = ?",
      [status, id]
    );
    connection.release();

    return result.affectedRows > 0;
  },
  validateAndUpdateClientStatus: async (id: number): Promise<boolean> => {
    try {
      const clientDocuments =
        await documentService.getThisMonthDocumentsByOwner(
          DocumentOwnerType.CLIENT,
          id
        );

      // Filter out documents with status "EN_ESPERA" or "SIN_ENTREGA"
      const filteredDocuments = clientDocuments.filter(
        (doc) =>
          doc.validStatus !== DocumentStatus.EN_ESPERA &&
          doc.validStatus !== DocumentStatus.SIN_ENTREGA
      );

      if (filteredDocuments.length === 0) {
        return false;
      }

      const hasRejectedDocument = filteredDocuments.some(
        (doc) => doc.validStatus === DocumentStatus.RECHAZADO
      );

      if (hasRejectedDocument) {
        await clientService.updateClientStatus(id, DocumentStatus.RECHAZADO);
        return true;
      }

      const allDocumentsAccepted = filteredDocuments.every(
        (doc) => doc.validStatus === DocumentStatus.ACEPTADO
      );

      if (allDocumentsAccepted) {
        await clientService.updateClientStatus(id, DocumentStatus.ACEPTADO);
        return true;
      }

      await clientService.updateClientStatus(id, DocumentStatus.POR_VALIDAR);
      return true;
    } catch (error) {
      console.error("Error validating and updating client status:", error);
      throw error;
    }
  },
};

export default clientService;
