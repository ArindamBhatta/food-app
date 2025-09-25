import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { AuthPayload } from "../dto/Auth.dto";
import { Request } from "express";

const API_SECRET = process.env.API_SECRET;

// step 1: - Generate a salt
export const generateSalt = async (): Promise<string> => {
  return await bcrypt.genSalt();
};

// step 2: - hashing the password
export const hashPassword = async (
  password: string,
  salt: string
): Promise<string> => {
  return await bcrypt.hash(password, salt);
};

// step 3: - cracking password boolean
export const verifyPassword = async (
  enteredPassword: string,
  savedPassword: string,
  salt: string
): Promise<boolean> => {
  const hashedPassword = await hashPassword(enteredPassword, salt);
  return hashedPassword === savedPassword;
};

// Generate JWT token
/* 
A server-wide secret key (e.g., process.env.API_SECRET) used to sign and verify JWT tokens.
It has nothing to do with hashing passwords or salts.
It must be the same on token creation and token verification, but should never leave the server.

*/
export const generateAccessToken = (payload: AuthPayload): string => {
  if (!API_SECRET) {
    throw new Error("API_SECRET is not defined");
  }
  return jwt.sign(payload, API_SECRET, { expiresIn: "1d" });
};

// Generate refresh token (longer expiry)
export const generateRefreshToken = (payload: AuthPayload): string => {
  if (!API_SECRET) {
    throw new Error("API_SECRET is not defined");
  }

  return jwt.sign(payload, API_SECRET, { expiresIn: "7d" });
};

// Validate JWT token from request
export const validateAccessToken = async (req: Request): Promise<boolean> => {
  const signature = req.get("Authorization");

  if (!signature || !API_SECRET) {
    return false;
  }

  try {
    const token = signature.split(" ")[1];
    if (!token) {
      return false;
    }

    const payload = jwt.verify(token, API_SECRET) as AuthPayload;
    req.user = payload;
    return true;
  } catch (error) {
    console.error("Token validation error:", error);
    return false;
  }
};

// Verify refresh token
export const verifyRefreshToken = (token: string): AuthPayload | null => {
  if (!API_SECRET) {
    return null;
  }

  try {
    const payload = jwt.verify(token, API_SECRET) as AuthPayload;
    return payload;
  } catch (error) {
    console.error("Refresh token verification error:", error);
    return null;
  }
};

/* 
Why Combining AuthPayload is good Architecture:
Unified Authentication System Single auth utilities (generateToken, validateToken) work for both vendors and customers.
No need to duplicate authentication logic.
Consistent token structure across your application

2. Type Safety with Flexibility
Union type AuthPayload = VendorPayload | CustomerPayload provides type safety
Type guards (isVendorPayload, isCustomerPayload) help distinguish at runtime
Single middleware can handle both user types

3. Easy to add new user types (admin, delivery, etc.) just by extending the union
Auth utilities automatically work with new types
Centralized authentication logic

4. Code Reusability
Same refresh token logic works for both vendors and customers
Single authentication middleware
Shared JWT validation logic

5. Consistent API Design
All login endpoints return similar response structures
Unified error handling
Same token refresh mechanism

Benefits of Your Current Structure:

Single Source of Truth: AuthPayload serves as the contract for all authentication
Polymorphism: Your auth functions work with any user type without modification
Maintainability: Changes to auth logic affect all user types consistently
Testing: Easier to test auth logic once rather than per user type

This is exactly why union types and discriminated unions exist in TypeScript - to handle scenarios where you have similar but distinct data structures that need unified handling. Your architecture is spot-on for a multi-user-type system!
*/
