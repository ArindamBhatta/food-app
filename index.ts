import express from "express";

import bodyParser from "body-parser";

import { AdminRoute, VenderRoute } from "./routes";

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const PORT = process.env.PORT || 3000;

app.use("/admin", AdminRoute);
app.use("/Vendor", VenderRoute);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
