````
# Food Delivery App Database Design NoSQL

### 1. Customers Collection

```javascript
{
id: ObjectId("..."),
// not create a new collection of cart
cart: [
       {
        foodId: { type: Schema.Types.ObjectId, ref: "food", require: true },
        unit: { type: Number, require: true },
       },

       {
        foodId: { type: Schema.Types.ObjectId, ref: "food", require: true },
        unit: { type: Number, require: true },
       },
    ],
//one to many
orders: [
          {
            type: Schema.Types.ObjectId, ref: "order"
          },

          {
            type: Schema.Types.ObjectId, ref: "order"
          }
        ],
}

````

### 2. Vendors Collection

```javascript
{
  _id: ObjectId("..."),
  //if we store foods id's in an array, we don't needs to fetch foods collection to get food details
  foods: [
            {
                type: mongoose.SchemaTypes.ObjectId,
                ref: "food",
            },

            {
                type: mongoose.SchemaTypes.ObjectId,
                ref: "food",
            },
  ],
}
```

### 3. Orders Collection

```javascript
{
  _id: ObjectId("..."),
  orderNumber: String, // Unique order number
  customerId: ObjectId("..."),
  customerName: String,
  vendorId: ObjectId("..."),
  vendorName: String,
  items: [
    {},
    {},
    {}
  ],
  subtotal: Number,
  deliveryFee: Number,
  tax: Number,
  total: Number,
  deliveryAddress: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    coordinates: {
      type: String,
      coordinates: [Number, Number]
    }
  },
  status: String,
  payment: {
    method: String, // 'card', 'cash', 'online_payment'
    status: String, // 'pending', 'completed', 'failed', 'refunded'
    transactionId: String,
    amount: Number
  },
  deliveryPerson: {
    id: ObjectId("..."),
    name: String,
    phone: String
  },
  estimatedDeliveryTime: Date,
  deliveredAt: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### 4. DeliveryPersons Collection

```javascript
{
  _id: ObjectId("..."),
  name: String,
  email: String,
  phone: String,
  password: String,
  vehicle: {
    type: String, // 'bike', 'scooter', 'bicycle', 'car'
    number: String
  },
  currentLocation: {
    type: String, // 'Point'
    coordinates: [Number, Number], // [longitude, latitude]
    lastUpdated: Date
  },
  isAvailable: Boolean,
  isActive: Boolean,
  rating: Number,
  totalDeliveries: Number,
  currentOrder: ObjectId("..."), // Reference to current order
  createdAt: Date,
  updatedAt: Date
}
```
