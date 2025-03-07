import { google } from "googleapis";
import { drive_v3 } from "googleapis";
import { Readable } from "stream";
import {
  GoogleDriveFile,
  DocumentOwnerType,
  FileUpload,
} from "../interfaces/IGoogleDriveInterfaces";
import { DocumentType } from "../interfaces/IDocumentInterfaces";

const KEYPATH: string =
  "/Users/tonynogueron/Documents/Tec/Universidad/Materias/8vo Semestre/Bloque Hilados/TI3005B/API/src/google-drive/GDriveAPIKEY.json";
const SCOPES: string[] = ["https://www.googleapis.com/auth/drive"];

const auth = new google.auth.GoogleAuth({
  keyFile: KEYPATH,
  scopes: SCOPES,
});

const drive: drive_v3.Drive = google.drive({
  version: "v3",
  auth,
});

const GoogleDrive = {
  listFolders: async (): Promise<GoogleDriveFile[] | void> => {
    try {
      const res = await drive.files.list({
        q: "mimeType='application/vnd.google-apps.folder'",
        fields: "files(id, name)",
        supportsAllDrives: true,
        includeItemsFromAllDrives: true,
      });

      const files: GoogleDriveFile[] = (res.data.files || [])
        .map((file) => ({
          id: file.id ?? "Unknown ID", // Ensure `id` is always a string
          name: file.name ?? "Unnamed Folder",
        }))
        .filter((file) => file.id !== "Unknown ID"); // Remove invalid entries

      console.log("Folders in Drive:");
      files.forEach((folder) => {
        console.log(`${folder.name} (${folder.id})`);
      });

      return files;
    } catch (error) {
      console.error("Error listing folders:", error);
    }
  },

  listFiles: async (): Promise<GoogleDriveFile[] | void> => {
    try {
      const res = await drive.files.list({
        fields: "files(id, name, mimeType)",
        supportsAllDrives: true,
        includeItemsFromAllDrives: true,
      });

      const files: GoogleDriveFile[] = (res.data.files || [])
        .map((file) => ({
          id: file.id ?? "Unknown ID",
          name: file.name ?? "Unnamed File",
          mimeType: file.mimeType ?? undefined, // Convert `null` to `undefined`
        }))
        .filter((file) => file.id !== "Unknown ID");

      if (files.length === 0) {
        console.log("No files found.");
        return;
      }

      console.log("Files:");
      files.forEach((file) => {
        console.log(`${file.name} (${file.mimeType}) - ID: ${file.id}`);
      });
      return files;
    } catch (error) {
      console.error("Error listing files:", error);
    }
  },

  findOrCreateFolder: async (
    parentId: string,
    folderName: string
  ): Promise<string> => {
    // Search for the folder in the parent folder
    const res = await drive.files.list({
      q: `mimeType='application/vnd.google-apps.folder' and name='${folderName}' and '${parentId}' in parents`,
      fields: "files(id)",
      supportsAllDrives: true,
      includeItemsFromAllDrives: true,
    });

    if (res.data.files && res.data.files.length > 0) {
      // Folder exists, return its ID
      return res.data.files[0].id!;
    } else {
      // Create a new folder
      const folderMetadata = {
        name: folderName,
        mimeType: "application/vnd.google-apps.folder",
        parents: [parentId],
      };

      const folder = await drive.files.create({
        requestBody: folderMetadata,
        fields: "id",
        supportsAllDrives: true,
      });

      return folder.data.id!;
    }
  },

  uploadFile: async (
    files: FileUpload[],
    name: string,
    type: DocumentOwnerType,
    month: string,
    year: string,
    rootFolderId: string
  ): Promise<GoogleDriveFile[] | void> => {
    try {
      // Create the year folder
      const yearFolderId = await GoogleDrive.findOrCreateFolder(
        rootFolderId,
        year
      );

      // Client or provider folder
      const ownerFolderId = await GoogleDrive.findOrCreateFolder(
        yearFolderId,
        type === DocumentOwnerType.CLIENT ? "Clientes" : "Proveedores"
      );

      // Create the month folder
      const monthFolderId = await GoogleDrive.findOrCreateFolder(
        ownerFolderId,
        month
      );

      // Create the owner folder
      const clientFolderId = await GoogleDrive.findOrCreateFolder(
        monthFolderId,
        name
      );

      const uploadedFiles: GoogleDriveFile[] = [];

      // Upload the file to the client folder
      for (const file of files) {
        try {
          const fileMetadata = {
            name: file.name,
            parents: [clientFolderId],
          };

          const media = {
            mimeType: file.type,
            body: Readable.from(file.data),
          };

          const fileCreationRes = await drive.files.create({
            requestBody: fileMetadata,
            media: media,
            fields: "id, name, mimeType, webViewLink",
            supportsAllDrives: true,
          });

          console.log(`File uploaded to folder ID: ${clientFolderId}`);
          uploadedFiles.push({
            id: fileCreationRes.data.id!,
            name: fileCreationRes.data.name!,
            mimeType: fileCreationRes.data.mimeType!,
            webViewLink: fileCreationRes.data.webViewLink!,
            documentType: file.documentType!,
          });
        } catch (error) {
          console.error(`Error uploading file ${file.name}:`, error);
        }
      }

      return uploadedFiles;
    } catch (error) {
      console.error("Error uploading files:", error);
    }
  },

  listFolderTree: async (
    parentId: string = "root",
    level: number = 0
  ): Promise<void> => {
    try {
      // List the folders inside the specified parent folder
      const res = await drive.files.list({
        q: `'${parentId}' in parents and mimeType='application/vnd.google-apps.folder'`,
        fields: "files(id, name)",
        supportsAllDrives: true,
        includeItemsFromAllDrives: true,
      });

      const folders = res.data.files || [];

      if (folders.length > 0) {
        console.log(" ".repeat(level * 2) + `Folders under ID: ${parentId}`);
        folders.forEach((folder) => {
          console.log(
            `${" ".repeat(level * 2)}- ${folder.name} (ID: ${folder.id})`
          );
          // Recursively list subfolders
          GoogleDrive.listFolderTree(folder.id!, level + 1); // Recursive call to list subfolders
        });
      } else {
        console.log(" ".repeat(level * 2) + "No subfolders found.");
      }
    } catch (error) {
      console.error("Error listing folders:", error);
    }
  },
};

export default GoogleDrive;
