import dotenv from "dotenv";
dotenv.config();

import express from "express";
import App from "./service/ExpressApp";
import dbConnection from "./service/Database";

const StartServer = async () => {
  const app = express();
  const port = process.env.PORT || 8000;

  await dbConnection();
  await App(app);

  app.listen(port, () => {
    console.log(`✅ Server is running on port ${port}`);
  });
};

StartServer();
