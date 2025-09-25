import { Document } from "mongoose";
import { VendorPayload } from "./interface/Vendor.dto";
import { CustomerPayload } from "./interface/Customer.dto";

export type AuthPayload = VendorPayload | CustomerPayload;

export interface UserDocument extends Document {
  email: string;
  password: string;
  salt: string;
  name?: string;
  verifyPassword(password: string): Promise<boolean>;
  generateToken(): string;
}

export interface LoginCredentials {
  email: string;
  password: string;
  userType: "vendor" | "customer";
}

export interface RegisterCredentials
  extends Omit<LoginCredentials, "userType"> {
  name: string;
  userType: "vendor" | "customer";
  // Additional fields can be added here based on user type
  [key: string]: any;
}

export interface AuthResponse<T = any> {
  success: boolean;
  token?: string;
  user?: T;
  message?: string;
  errors?: string[];
}

//Correct type guards based on actual payload properties
export function isVendorPayload(
  payload: AuthPayload
): payload is VendorPayload {
  return (
    payload.role === "vendor" &&
    "foodType" in payload &&
    "serviceAvailable" in payload
  );
}

export function isCustomerPayload(
  payload: AuthPayload
): payload is CustomerPayload {
  return payload.role === "customer" && "verified" in payload;
}
