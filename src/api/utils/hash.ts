import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { AuthPayload } from "../dto/Auth.dto";
import { Request } from "express";

const API_SECRET = process.env.API_SECRET;

if (!API_SECRET) {
  console.error(
    "❌ API_SECRET environment variable not set. Please check your .env file."
  );
  process.exit(1);
}

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
export const generateToken = (payload: AuthPayload): string => {
  if (!API_SECRET) {
    throw new Error("API_SECRET is not defined");
  }
  return jwt.sign(payload, API_SECRET, { expiresIn: "1d" });
};

// Validate JWT token from request
export const validateToken = async (req: Request): Promise<boolean> => {
  const signature = req.get("Authorization");

  if (!signature || !API_SECRET) {
    return false;
  }

  try {
    const token = signature.split(" ")[1];
    const payload = jwt.verify(token, API_SECRET) as AuthPayload;
    req.user = payload;
    return true;
  } catch (error) {
    console.error("Token validation error:", error);
    return false;
  }
};
