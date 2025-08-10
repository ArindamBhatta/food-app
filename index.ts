import express from "express";
import App from "./service/ExpressApp";
import dbConnection from "./service/Database";

const StartServer = async () => {
  const app = express();
  await dbConnection();

  await App(app);

  app.listen(8000, () => {
    console.log("Server is running on port 8000");
  });
};

StartServer();
