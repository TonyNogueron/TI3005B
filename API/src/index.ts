import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import authRouter from "./routes/authRoute";

// import GoogleDrive from "./google-drive/drive";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;


app.use(cors());
app.use(express.json());

app.use("/", authRouter);


app.get("/", (req, res) => {
  res.send("API is running");
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// GoogleDrive.listFolders();
// GoogleDrive.listFolderTree("1UMN93x7R_B29gBSyUc5QprNRQT6yhGMK", 0);
