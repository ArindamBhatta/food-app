# Food Delivery App

A scalable, modular, and maintainable food delivery backend built with Node.js, TypeScript, Express, and MongoDB, following the Clean Architecture pattern.

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
- **Mongoose model**: infrastructure
- **Repositories**: Bridge
- **Services**: Business logic
- **Controllers + DTOs**: Presentation.

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

---

**This project is architected for real-world scalability and maintainability. Built with Clean Architecture principles for professional Node.js applications.**

---
