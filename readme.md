# Food Delivery App

A scalable, modular, and maintainable food delivery backend built with Node.js, TypeScript, Express, and MongoDB, following the Clean Architecture pattern.

## Clean Architecture

The codebase is organized in layers to enforce separation of concerns:

Core business models : - **Entities**

ODM : - **Mongoose model**

DBOperation : - **Repositories**

Business logic : - **Services**

Presentation : - **Controllers + DTOs**

## 📊 Database Schema

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

## Tech Stack

- Node.js, TypeScript, Express.js
- MongoDB (Mongoose ODM)
- Cloudinary (image upload)
- JWT authentication
- Winston logger
