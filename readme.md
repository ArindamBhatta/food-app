# Food Delivery App

A scalable, modular, and maintainable food delivery backend built with Node.js, TypeScript, Express, and MongoDB, following the Clean Architecture pattern.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Clean Architecture](#clean-architecture)
- [Project Structure](#project-structure)
- [Tech Stack](#tech-stack)
- [Setup & Installation](#setup--installation)
- [Usage](#usage)
- [Contributing](#contributing)

---

## Overview

This project is a backend API for a food delivery platform supporting customers, vendors, food management, orders, authentication, and more. It is designed for clarity, testability, and easy extension.

## Features

- User authentication (JWT, OTP)
- Customer and vendor management
- Food catalog and cart
- Order placement and tracking
- Cloud image upload
- Role-based access
- Modular, testable codebase

## Clean Architecture

The codebase is organized in layers to enforce separation of concerns:

- **Entities**: Core business models (e.g., Customer, Vendor, Food, Order)
- **DTOs**: Data transfer objects, for request/response validation
- **Repositories**: Database access, isolated from business logic
- **Services**: Business logic, orchestrates repositories and implements use cases
- **Controllers**: Handle HTTP requests/responses, call services
- **Infrastructure**: External dependencies (database, logger, cache)

**Benefits:**

- Independent of frameworks and UI
- Easy to test and maintain
- Flexible to change technology or database

```
src/
  api/
    controller/   # Express controllers (entry points)
    dto/          # Request/response DTOs
    entities/     # Business models
    repos/        # Data access (Repository pattern)
    services/     # Use case/business logic
  infrastructure/ # DB, logger, cache, etc.
  constants.ts    # Shared constants
```

## Tech Stack

- Node.js, TypeScript, Express.js
- MongoDB (Mongoose ODM)
- Cloudinary (image upload)
- JWT authentication
- Winston logger

## Setup & Installation

1. **Clone the repo:**
   ```bash
   git clone https://github.com/ArindamBhatta/food-app
   cd food-app
   ```
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Configure environment:**
   - Copy `.env.example` to `.env` and fill in required values.
4. **Run the app:**
   ```bash
   npm run dev
   ```

## Usage

- Access API endpoints via Postman or frontend client.

## Contributing

Pull requests are welcome! Please follow the existing code style and architectural guidelines.

---

**This project is architected for real-world scalability and maintainability. Built with Clean Architecture principles for professional Node.js applications.**
