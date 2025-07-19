import express from "express";

import bodyParser from "body-parser";
import mongoose from "mongoose";
import { AdminRoute, VenderRoute } from "./routes";
import { MONGO_URL } from "./config";

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const PORT = process.env.PORT || 3000;

app.use("/admin", AdminRoute);
app.use("/Vendor", VenderRoute);

mongoose
  .connect(MONGO_URL, {})
  .then(() => {
    console.log("✅ MongoDB connected successfully!");
  })
  .catch((error) => {
    console.log("❌ MongoDB connection failed:", error);
  });

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
