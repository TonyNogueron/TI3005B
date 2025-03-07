import pool from "../config/dbconfig";
import {
  Document,
  DocumentStatus,
  DocumentType,
} from "../interfaces/IDocumentInterfaces";
import { RowDataPacket, ResultSetHeader } from "mysql2";
import { DocumentOwnerType } from "../interfaces/IGoogleDriveInterfaces";

const documentService = {
  getAllDocuments: async (): Promise<Document[]> => {
    const connection = await pool.getConnection();
    const [rows] = await connection.query<RowDataPacket[]>(
      "SELECT * FROM Document"
    );
    connection.release();
    return rows as Document[];
  },

  getDocumentsByStatus: async (status: DocumentStatus): Promise<Document[]> => {
    const connection = await pool.getConnection();
    const [rows] = await connection.query<RowDataPacket[]>(
      "SELECT * FROM Document WHERE validStatus = ?",
      [status]
    );
    connection.release();
    return rows as Document[];
  },

  getCurrentRequestedDocumentsByOwner: async (
    ownerType: DocumentOwnerType,
    ownerId: number
  ): Promise<Document[]> => {
    const connection = await pool.getConnection();
    const [rows] = await connection.query<RowDataPacket[]>(
      "SELECT * FROM Document WHERE ownerType = ? AND ownerId = ? AND validStatus = ?",
      [ownerType, ownerId, DocumentStatus.EN_ESPERA]
    );
    connection.release();
    return rows as Document[];
  },

  updateDocumentValid: async (id: number): Promise<boolean> => {
    const connection = await pool.getConnection();
    const [result] = await connection.query<ResultSetHeader>(
      "UPDATE Document SET validStatus = ? WHERE id = ?",
      [DocumentStatus.ACEPTADO, id]
    );
    connection.release();
    return result.affectedRows > 0;
  },

  updateDocumentRejected: async (
    id: number,
    rejectedReason: string = "Documento inválido"
  ): Promise<boolean> => {
    const connection = await pool.getConnection();
    const [result] = await connection.query<ResultSetHeader>(
      "UPDATE Document SET validStatus = ?, rejectedReason = ? WHERE id = ?",
      [DocumentStatus.RECHAZADO, rejectedReason, id]
    );
    connection.release();
    return result.affectedRows > 0;
  },

  updateUploadedDocument: async (
    id: number,
    fileName: string,
    fileType: string,
    fileUrl: string
  ): Promise<boolean> => {
    const connection = await pool.getConnection();
    const [result] = await connection.query<ResultSetHeader>(
      "UPDATE Document SET fileName = ?, fileType = ?, fileUrl = ?, uploadTimestamp = NOW(), validStatus = ? WHERE id = ?",
      [fileName, fileType, fileUrl, DocumentStatus.POR_VALIDAR, id]
    );
    connection.release();
    return result.affectedRows > 0;
  },

  createInitialDocument: async (
    ownerType: DocumentOwnerType,
    ownerId: number,
    documentType: DocumentType
  ): Promise<number> => {
    const connection = await pool.getConnection();
    const [result] = await connection.query<ResultSetHeader>(
      "INSERT INTO Document (ownerType, ownerId, documentType, requestedTimestamp, validStatus) VALUES (?, ?, ?, NOW(), ?)",
      [ownerType, ownerId, documentType, DocumentStatus.EN_ESPERA]
    );
    connection.release();
    return result.insertId;
  },

  insertFullDocument: async (document: Document): Promise<number> => {
    const connection = await pool.getConnection();
    const [result] = await connection.query<ResultSetHeader>(
      "INSERT INTO Document (ownerType, ownerId, documentType, fileName, fileType, fileUrl, uploadTimestamp, requestedTimestamp, validStatus) VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW(),?)",
      [
        document.ownerType,
        document.ownerId,
        document.documentType,
        document.fileName,
        document.fileType,
        document.fileUrl,
        DocumentStatus.POR_VALIDAR,
      ]
    );
    connection.release();
    return result.insertId;
  },
};

export default documentService;
