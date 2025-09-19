import mongoose from "mongoose";
import logger from "../logger/winston";

export default async () => {
  const mongoUri = process.env.MONGO_URL;

  if (!mongoUri) {
    logger.error(
      "❌ MONGO_URL environment variable not set. Please check your .env file."
    );
    process.exit(1);
  }

  try {
    await mongoose.connect(mongoUri);
    logger.info("✅ MongoDB connected successfully!");
  } catch (error) {
    logger.error("❌ MongoDB connection failed:", error);
    process.exit(1);
  }
};
