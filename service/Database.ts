import mongoose from "mongoose";
import { MONGO_URL } from "../config";

export default async () => {
  try {
    mongoose
      .connect(MONGO_URL, {
        // useNewUrlParser: true,
        // useUnifiedTopology: true,
        // useCreateIndex: true,
        // useFindAndModify: false,
      })
      .then(() => {
        console.log("✅ MongoDB connected successfully!");
      })
      .catch((error) => {
        console.log("❌ MongoDB connection failed:", error);
      });
  } catch (ex) {
    console.log(ex);
  }
};
