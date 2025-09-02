import mongoose, { Schema, Document, Model } from "mongoose";

interface OrderDoc extends Document {
  orderID: string; // 5678912
  items: [any]; //[{food, unit: 1}]
  totalAmount: number; //456
  orderDate: Date;
  paidThrough: string; //COD
  paymentResponse: string; //{status:true, response: some bank response}
  orderStatus: string; //pending, accepted, rejected
}

const OrderSchema = new Schema(
  {
    orderID: { type: String, require: true },
    items: [
      {
        food: { type: Schema.Types.ObjectId, ref: "food", require: true },
        unit: { type: Number, require: true },
      },
    ],
    totalAmount: { type: Number, require: true },
    orderDate: { type: Date },
    paidThrough: { type: String },
    paymentResponse: { type: String },
    orderStatus: { type: String },
  },
  {
    toJSON: {
      transform(doc, ret: any) {
        delete ret.__v;
        delete ret.createdAt;
        delete ret.updatedAt;
      },
    },
    timestamps: true,
  }
);

const Order = mongoose.model<OrderDoc>("order", OrderSchema);

export { Order, OrderDoc };
