import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import authRouter from "./routes/authRoute";
import documentRouter from "./routes/documentRoute";
import dashboardRouter from "./routes/dashboardRoute";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

app.use("/", authRouter);
app.use("/documents", documentRouter);
app.use("/dashboard", dashboardRouter);

app.get("/", (req, res) => {
  res.send("API is running");
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
