import mongoose, { Schema, Document, Model } from "mongoose";

// The VenderDoc interface extends Mongoose's Document interface and defines the structure of your vendor documents. This gives you type safety when working with vendor data:
interface VenderDoc extends Document {
  name: string;
  ownerName: string;
  foodType: [string];
  pincode: string;
  address: string;
  phone: string;
  email: string;
  password: string;
  salt: string;
  serviceAvailable: string;
  coverImages: [string];
  rating: number;
  // foods: any;
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
    // foods: [
    //   {
    //     type: mongoose.SchemaTypes.ObjectId,
    //     ref: "food",
    //   },
    // ],
  },
  {
    //transform to jon for retrieve data

    toJSON: {
      transform(doc, ret) {
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
// This tells Mongoose that documents created from this model will have the structure defined in VenderDoc.
const Vendor = mongoose.model<VenderDoc>("vendor", VendorSchema);

export { Vendor, VenderDoc };
