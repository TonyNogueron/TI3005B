import pool from "../config/dbconfig";
import { IUser } from "../interfaces/IUserInterface";
import { RowDataPacket, ResultSetHeader } from "mysql2";
import jwt from "jsonwebtoken";
import { OwnerType } from "../interfaces/IDocumentInterfaces";

const authService = {
  getUserByEmailAndPassword: async (
    email: string,
    password: string
  ): Promise<IUser | null> => {
    const connection = await pool.getConnection();
    const [rows] = await connection.query<RowDataPacket[]>(
      "SELECT * FROM User WHERE email = ? AND password = ?",
      [email, password]
    );
    connection.release();

    if (rows.length > 0) {
      return rows[0] as IUser;
    } else {
      return null;
    }
  },

  createUser: async (user: IUser): Promise<number> => {
    const connection = await pool.getConnection();
    const [result] = await connection.query<ResultSetHeader>(
      "INSERT INTO User (email, password, name) VALUES (?, ?, ?)",
      [user.email, user.password, user.name]
    );
    connection.release();

    return result.insertId;
  },

  updateUser: async (user: IUser): Promise<boolean> => {
    const connection = await pool.getConnection();
    const [result] = await connection.query<ResultSetHeader>(
      "UPDATE User SET email = ?, password = ?, name = ? WHERE id = ?",
      [user.email, user.password, user.name, user.id]
    );
    connection.release();

    return result.affectedRows > 0;
  },

  deleteUser: async (id: number): Promise<boolean> => {
    const connection = await pool.getConnection();
    const [result] = await connection.query<ResultSetHeader>(
      "DELETE FROM User WHERE id = ?",
      [id]
    );
    connection.release();

    return result.affectedRows > 0;
  },

  generateUploadToken: async (
    ownerType: OwnerType,
    ownerId: number
  ): Promise<string> => {
    const payload = {
      ownerType,
      ownerId,
      issuedAt: Date.now(),
      validFor: "5 days",
    };
    return jwt.sign(payload, process.env.JWT_SECRET as string, {
      expiresIn: "5d",
    });
  },

  decryptUploadToken: async (token: string): Promise<any> => {
    return jwt.verify(token, process.env.JWT_SECRET as string);
  },
};

export default authService;
