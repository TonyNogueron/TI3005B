import pool from "../config/dbconfig";
import { Vendor } from "../interfaces/IVendorInterfaces";
import { RowDataPacket, ResultSetHeader } from "mysql2";

const VendorService = {
  getAllVendors: async (): Promise<Vendor[]> => {
    const connection = await pool.getConnection();
    const [rows] = await connection.query<RowDataPacket[]>(
      "SELECT * FROM Vendor"
    );
    connection.release();
    return rows as Vendor[];
  },

  getVendorById: async (id: number): Promise<Vendor | null> => {
    const connection = await pool.getConnection();
    const [rows] = await connection.query<RowDataPacket[]>(
      "SELECT * FROM Vendor WHERE id = ?",
      [id]
    );
    connection.release();

    if (rows.length > 0) {
      return rows[0] as Vendor;
    } else {
      return null;
    }
  },

  createVendor: async (vendor: Vendor): Promise<number> => {
    const connection = await pool.getConnection();
    const [result] = await connection.query<ResultSetHeader>(
      "INSERT INTO Vendor (name, email, phoneNumber, isActive) VALUES (?, ?, ?, ?)",
      [vendor.name, vendor.email, vendor.phoneNumber, vendor.isActive]
    );
    connection.release();

    return result.insertId;
  },

  updateVendor: async (vendor: Vendor): Promise<boolean> => {
    const connection = await pool.getConnection();
    const [result] = await connection.query<ResultSetHeader>(
      "UPDATE Vendor SET name = ?, email = ?, phoneNumber = ?, isActive = ? WHERE id = ?",
      [
        vendor.name,
        vendor.email,
        vendor.phoneNumber,
        vendor.isActive,
        vendor.id,
      ]
    );
    connection.release();

    return result.affectedRows > 0;
  },
  
  deleteVendor: async (id: number): Promise<boolean> => {
    const connection = await pool.getConnection();
    const [result] = await connection.query<ResultSetHeader>(
      "DELETE FROM Vendor WHERE id = ?",
      [id]
    );
    connection.release();

    return result.affectedRows > 0;
  },
};

export default VendorService;
