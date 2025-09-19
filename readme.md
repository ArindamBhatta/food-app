### Admin specific work

1. Admin can create vendors

2. Admin gets a list of all vendors

3. 3. Admin gets details of a specific vendor.

### Vendor specific work

1.Vendor can view his own profile.

2.Vendor can update his own profile.

3. Vendor can add Food.

### Create a vendor

steps: -

1. AdminRoute -> go to create a vendor route

2. AdminController -> create a method call createVendor
   2.1. DTO -> a interface for checking request body is valid or not
   2.2. find the vendor email is already exist.
   2.3. if not exist generate a salt bcrypt.genSalt();
   2.4. then send the user password and salt. to generate password.
   2.5. store everything in database.

   ### mongoose update method

   Model.updateOne(), Model.updateMany(), Model.findByIdAndUpdate() skip schema validation.
   This is because these methods operate directly at the MongoDB level, without loading a Mongoose document into memory

   - minlength: 3 -> ✅ No error — it will save "A" to the database, even though it breaks your schema rule
   - runValidators: true

   ### mongoose hook

   - Runs Mongoose middleware/hooks (pre('save'), post('save')).

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

## Indexes

1. **Customers Collection**

   - `{ email: 1 }` - Unique index for email
   - `{ 'address.coordinates': '2dsphere' }` - Geospatial index for location-based queries

2. **Vendors Collection**

   - `{ email: 1 }` - Unique index for email
   - `{ 'address.coordinates': '2dsphere' }` - For finding nearby vendors
   - `{ cuisineType: 1 }` - For filtering by cuisine
   - `{ isOpen: 1 }` - For filtering open/closed vendors

3. **Orders Collection**

   - `{ customerId: 1 }` - For fetching customer's order history
   - `{ vendorId: 1 }` - For vendor's order management
   - `{ status: 1 }` - For filtering orders by status
   - `{ 'deliveryAddress.coordinates': '2dsphere' }` - For delivery routing
   - `{ orderNumber: 1 }` - Unique index for order lookup

4. **DeliveryPersons Collection**
   - `{ email: 1 }` - Unique index for email
   - `{ 'currentLocation': '2dsphere' }` - For finding nearest delivery person
   - `{ isAvailable: 1 }` - For finding available delivery persons

## Data Access Patterns

1. **Customer Operations**

   - View nearby restaurants (geospatial query on Vendors)
   - Browse menu (single document query on Vendors)
   - View order history (query on Orders by customerId)
   - Update cart (embedded document in Customers)

2. **Vendor Operations**

   - Manage menu (embedded array in Vendors)
   - View and update orders (query on Orders by vendorId)
   - Update order status (update on Orders)

3. **Delivery Operations**
   - Find nearby orders (geospatial query on Orders)
   - Update order status (update on Orders)
   - Update location (update on DeliveryPersons)

## Notes on Design Decisions

1. **Denormalization**: We've denormalized some data (like food details in orders) to improve read performance and reduce the need for joins.

2. **Embedded Documents**: Used for data that is frequently accessed together (like order items within an order).

3. **References**: Used for relationships where the related data is large or changes frequently (like customer references in orders).

4. **Geospatial Data**: Used 2dsphere indexes for location-based queries to find nearby vendors and route deliveries.

5. **Scalability**: The design supports horizontal scaling through sharding on appropriate keys (e.g., vendorId for Orders).

```

```

# Food Delivery App Database Design Sql

- One to Many Relationship

  > Customer create multiple order

  - in Order table we store a foreign key call CustomerId

  > Vendor create multiple food

  - in Food table we store a foreign key call VendorId

  > Customer cart we store many food with quantity

  - in Customer table we store a foreign key call CartId

- Many to Many Relationship

  > In Order we have many foods, and one food can be in multiple orders

---

- How to solve many to many relationship?

        Create a new table call OrderItems

        OrderItems can store a foreign key call OrderId

        OrderItems can store a foreign key call FoodId
