# Food Delivery App Database Design

### one to many relationship: -

1. customer create multiple order.
2. vendor create multiple foods.

### Many to Many relationship-

- in customer one order he select multiple food,
- one food e.g (fish) can stay in multiple order

## 📊 Database Schema

### SQL Schema (Relational)

```mermaid
erDiagram
    CUSTOMER ||--o{ ORDER : places
    VENDOR ||--o{ FOOD : provides
    ORDER ||--o{ ORDER_FOOD : contains
    FOOD ||--o{ ORDER_FOOD : included_in

    CUSTOMER {
        int id PK
        string name
    }
    VENDOR {
        int id PK
        string name
    }
    FOOD {
        int id PK
        int vendor_id FK
        string name
    }
    ORDER {
        int id PK
        int customer_id FK
        datetime created_at
    }
    ORDER_FOOD {
        int id PK
        int order_id FK
        int food_id FK
        int unit
    }
```

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
