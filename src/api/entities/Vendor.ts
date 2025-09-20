import mongoose, { Schema, Document, Model } from "mongoose";
import { FoodDoc } from "./Food";

// 1. TypeScript Interface - Defines the shape of your data
interface VendorDoc extends Document {
  name: string;
  ownerName: string;
  foodType: [string];
  pincode: string;
  address: string;
  phone: string;
  email: string;
  password: string;
  salt: string;
  serviceAvailable: boolean;
  coverImages: [string]; //shop banner
  rating: number;
  foods: [FoodDoc]; //store the food doc
}

//2. Mongoose Schema - Defines database structure and validation
const VendorSchema = new Schema(
  {
    name: { type: String, require: true },
    ownerName: { type: String, require: true },
    foodType: { type: [String] },
    pincode: { type: String, require: true },
    address: { type: String, require: true },
    phone: { type: String, require: true },
    email: { type: String, require: true },
    password: { type: String, require: true },
    salt: { type: String, require: true },
    serviceAvailable: { type: Boolean },
    coverImages: { type: [String] },
    rating: { type: Number },
    foods: [
      {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "food",
      },
    ],
  },
  {
    //transform to json for retrieve data

    toJSON: {
      transform(doc, ret: any) {
        delete ret.password;
        delete ret.salt;
        delete ret.__v;
        delete ret.createdAt;
        delete ret.updatedAt;
      },
    },
    timestamps: true,
  }
);

const Vendor = mongoose.model<VendorDoc>("vendor", VendorSchema);

export { Vendor, VendorDoc };

/*
1. VendorDoc Interface:
   - Provides TypeScript type safety
   - Defines what properties a vendor document should have
   - Extends Document (from Mongoose) to get _id, save(), etc.

2. VendorSchema:
   - Defines the actual database structure
   - Sets validation rules (required, default values)
   - Configures JSON transformation (hides password, salt)
   - Adds timestamps (createdAt, updatedAt)

3. Vendor Model:
   - The actual Mongoose model you use for database operations
   - Combines the schema with the TypeScript interface
   - Provides methods like .create(), .find(), .findById(), etc.
*/
