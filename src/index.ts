import dotenv from "dotenv";
import cors from "cors";
import bodyParser from "body-parser";
import express from "express";
import apiRouter from "./api";
import connectDB, { db } from "./infrastructure/database";
import logger from "./infrastructure/logger/winston";

// Load environment variables
dotenv.config();

// Initialize Express
const app = express();
const port = process.env.PORT || 8001;

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "10mb" }));

// API routes
app.use("/api", apiRouter());

// Start server
const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDB();

    // Start listening
    const server = app.listen(port, () => {
      logger.info(`✅ Server is running on http://localhost:${port}`);
    });

    // Handle graceful shutdown
    const gracefulShutdown = async () => {
      logger.info("🛑 Received shutdown signal, closing server...");

      server.close(async () => {
        logger.info("👋 HTTP server closed");

        // Close MongoDB connection
        if (db.connection.readyState === 1) {
          await db.connection.close();
          logger.info("👋 MongoDB connection closed");
        }

        process.exit(0);
      });
    };

    // Handle termination signals
    process.on("SIGTERM", gracefulShutdown);
    process.on("SIGINT", gracefulShutdown);
  } catch (error) {
    logger.error("❌ Failed to start server:", error);
    process.exit(1);
  }
};

// Start the application
startServer();

/* 

### one to many relationship: -

1. customer create multiple order.
2. vendor create multiple foods.

### Many to Many relationship-

- in customer one order he select multiple food,
- one food e.g (fish) can stay in multiple order
### NoSQL Schema (MongoDB Example)

```javascript
// Customer Document
{
  _id: ObjectId,
  name: String,
  cart: [
    { foodId: ObjectId, unit: Number }
  ],
  orders: [ObjectId] // refs to Order
}

// Vendor Document
{
  _id: ObjectId,
  name: String,
  foods: [ObjectId] // refs to Food
}

// Food Document
{
  _id: ObjectId,
  vendorId: ObjectId, // ref to Vendor
  name: String,
  ...
}

// Order Document
{
  _id: ObjectId,
  customerId: ObjectId, // ref to Customer
  foods: [
    { foodId: ObjectId, unit: Number }
  ],
  ...
}
```

*/
