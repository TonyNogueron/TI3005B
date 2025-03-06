import { google } from "googleapis";
import { drive_v3 } from "googleapis";
import { GoogleDriveFile } from "../interfaces/IGoogleDriveInterfaces";

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
};

export default GoogleDrive;
