import pool from "../config/dbconfig";
import {
  Document,
  DocumentStatus,
  DocumentType,
  OwnerType,
} from "../interfaces/IDocumentInterfaces";
import { RowDataPacket, ResultSetHeader } from "mysql2";
import { DocumentOwnerType } from "../interfaces/IGoogleDriveInterfaces";
import { Client, IClientDashboardRow } from "../interfaces/IClientInterfaces";
import { Vendor } from "../interfaces/IVendorInterfaces";
import {
  IProviderDashboardRow,
  Provider,
} from "../interfaces/IProviderInterfaces";

const dashboardService = {
  getClientDocumentsByStatusArray: async (
    statuses: DocumentStatus[]
  ): Promise<IClientDashboardRow[]> => {
    const connection = await pool.getConnection();
    try {
      // Get all clients that match the specified statuses
      const [clientRows] = await connection.query<RowDataPacket[]>(
        `SELECT * FROM Client 
           WHERE documentsStatus IN (${statuses.map(() => "?").join(", ")}) 
           AND isActive = 1`,
        statuses
      );

      const clients: Client[] = clientRows as Client[];

      if (clients.length === 0) return [];

      // Extract client IDs and vendor IDs
      const clientIds = clients.map((c) => c.id);
      const vendorIds = clients.map((c) => c.vendorId);

      // Get all vendors for these clients
      const [vendorRows] = await connection.query<RowDataPacket[]>(
        `SELECT * FROM Vendor WHERE id IN (${vendorIds
          .map(() => "?")
          .join(", ")})`,
        [...vendorIds]
      );

      const vendors = vendorRows as Vendor[];

      // Get all documents for these clients
      const [documentRows] = await connection.query<RowDataPacket[]>(
        `SELECT * FROM Document WHERE ownerId IN (${clientIds
          .map(() => "?")
          .join(", ")}) AND ownerType = "Client"
           AND MONTH(requestedTimestamp) = MONTH(CURDATE()) 
           AND YEAR(requestedTimestamp) = YEAR(CURDATE())`,
        [...clientIds]
      );

      const documents = documentRows as Document[];

      // Create the response object
      const clientDocuments: IClientDashboardRow[] = clients.map((client) => {
        const vendor = vendors.find((v) => v.id === client.vendorId) as Vendor;
        const clientDocs = documents.filter(
          (d) => d.ownerId === client.id
        ) as Document[];
        return { client, vendor, documents: clientDocs };
      });
      return clientDocuments;
    } catch (error) {
      console.error("Error fetching client documents:", error);
      throw error;
    } finally {
      connection.release();
    }
  },
  getProvidersDocumentsByStatusArray: async (
    statuses: DocumentStatus[]
  ): Promise<IProviderDashboardRow[]> => {
    const connection = await pool.getConnection();
    try {
      // Get all clients that match the specified statuses
      const [providerRows] = await connection.query<RowDataPacket[]>(
        `SELECT * FROM Provider 
           WHERE documentsStatus IN (${statuses.map(() => "?").join(", ")}) 
           AND isActive = 1`,
        statuses
      );

      const providers: Provider[] = providerRows as Provider[];

      if (providers.length === 0) return [];

      // Extract client IDs and vendor IDs
      const providerIds = providers.map((c) => c.id);
      const vendorIds = providers.map((c) => c.vendorId);

      // Get all vendors for these clients
      const [vendorRows] = await connection.query<RowDataPacket[]>(
        `SELECT * FROM Vendor WHERE id IN (${vendorIds
          .map(() => "?")
          .join(", ")})`,
        [...vendorIds]
      );

      const vendors = vendorRows as Vendor[];

      // Get all documents for these clients
      const [documentRows] = await connection.query<RowDataPacket[]>(
        `SELECT * FROM Document WHERE ownerId IN (${providerIds
          .map(() => "?")
          .join(", ")}) AND ownerType = "Provider"
           AND MONTH(requestedTimestamp) = MONTH(CURDATE()) 
           AND YEAR(requestedTimestamp) = YEAR(CURDATE())`,
        [...providerIds]
      );

      const documents = documentRows as Document[];

      // Create the response object
      const providersDocuments: IProviderDashboardRow[] = providers.map(
        (provider) => {
          const vendor = vendors.find(
            (v) => v.id === provider.vendorId
          ) as Vendor;
          const providerDocs = documents.filter(
            (d) => d.ownerId === provider.id
          ) as Document[];
          return { provider, vendor, documents: providerDocs };
        }
      );
      return providersDocuments;
    } catch (error) {
      console.error("Error fetching client documents:", error);
      throw error;
    } finally {
      connection.release();
    }
  },
};

export default dashboardService;
