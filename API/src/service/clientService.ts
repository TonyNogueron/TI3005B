import pool from "../config/dbconfig";
import { Client } from "../interfaces/IClientInterfaces";
import { RowDataPacket, ResultSetHeader } from "mysql2";

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
};

export default clientService;
