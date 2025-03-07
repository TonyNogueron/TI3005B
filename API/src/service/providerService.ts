import pool from "../config/dbconfig";
import { Provider } from "../interfaces/IProviderInterfaces";
import { RowDataPacket, ResultSetHeader } from "mysql2";

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
};

export default providerService;
