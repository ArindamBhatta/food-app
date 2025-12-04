// It can be replaced anytime (Prisma, SQL, anything else)

import mongoose, { Schema, Document } from "mongoose";

//VendorDocument is the interface for a Mongoose document
export interface VendorDocument extends Document {
  name: string;
  ownerName: string;
  foodType: string[];
  pincode: string;
  address: string;
  phone: string;
  email: string;
  password: string;
  salt: string;
  serviceAvailable: boolean;
  coverImages: string[]; //shop banner
  rating: number;
  foods: mongoose.Types.ObjectId[]; //store the food doc
  refreshToken: string | null;
  refreshTokenUpdatedAt: Date | null;
}

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
    refreshToken: { type: String, default: null },
    refreshTokenUpdatedAt: { type: Date, default: null },
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
        delete ret.refreshToken;
        delete ret.refreshTokenUpdatedAt;
      },
    },
    timestamps: true,
  }
);

export const VendorModel = mongoose.model<VendorDocument>(
  "vendor",
  VendorSchema
);

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
