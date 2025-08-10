import mongoose from "mongoose";

export default async () => {
  const mongoUri = process.env.MONGO_URL;

  console.log(mongoUri);

  if (!mongoUri) {
    console.error(
      "❌ MONGO_URL environment variable not set. Please check your .env file."
    );
    process.exit(1); // Exit if the database URL is not configured
  }

  try {
    await mongoose.connect(mongoUri);
    console.log("✅ MongoDB connected successfully!");
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error);
    process.exit(1); // Exit on connection failure
  }
};
