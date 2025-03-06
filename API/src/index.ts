import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import GoogleDrive from "./google-drive/drive";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("API is running");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

GoogleDrive.listFolders();
GoogleDrive.listFiles();
