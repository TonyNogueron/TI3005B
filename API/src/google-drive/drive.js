const { google } = require("googleapis");

const KEYPATH =
  "/Users/tonynogueron/Documents/Tec/Universidad/Materias/8vo Semestre/Bloque Hilados/TI3005B/API/src/google-drive/GDriveAPIKEY.json";
const SCOPES = ["https://www.googleapis.com/auth/drive"];

const auth = new google.auth.GoogleAuth({
  keyFile: KEYPATH,
  scopes: SCOPES,
});

const drive = google.drive({
  version: "v3",
  auth,
});

const GoogleDrive = {
  listFolders: async () => {
    try {
      const res = await drive.files.list({
        q: "mimeType='application/vnd.google-apps.folder'",
        fields: "files(id, name)",
        supportsAllDrives: true,
        includeItemsFromAllDrives: true,
      });

      console.log("Folders in Drive:");
      res.data.files.forEach((folder) => {
        console.log(`${folder.name} (${folder.id})`);
      });

      return res.data.files;
    } catch (error) {
      console.log("Error listing folders: ", error);
    }
  },

  listFiles: async () => {
    try {
      const res = await drive.files.list({
        fields: "files(id, name, mimeType)",
        supportsAllDrives: true,
        includeItemsFromAllDrives: true,
      });

      if (res.data.files.length === 0) {
        console.log("No files found.");
        return;
      }

      console.log("Files:");
      res.data.files.forEach((file) => {
        console.log(`${file.name} (${file.mimeType}) - ID: ${file.id}`);
      });
    } catch (error) {
      console.error("Error listing files:", error);
    }
  },
};

module.exports = GoogleDrive;
