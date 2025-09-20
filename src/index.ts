import dotenv from "dotenv";
import cors from "cors";
import bodyParser from "body-parser";
import express from "express";
import apiRouter from "./api";

dotenv.config();
const app = express();
const port = process.env.PORT || 8000;
// Enable CORS
app.use(cors());
app.use(bodyParser.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "10mb" }));

// API routes
app.use("/api", apiRouter());

app.listen(port, () => {
  console.log(`✅ Server is running on port ${port}`);
});
