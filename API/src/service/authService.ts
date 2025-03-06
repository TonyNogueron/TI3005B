import pool from "../config/dbconfig";
import { IUser } from "../interfaces/IUserInterface";
import { RowDataPacket, ResultSetHeader } from "mysql2";

const authService = {
    getUserByEmailAndPassword: async (email: string, password: string): Promise<IUser | null> => {
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
};