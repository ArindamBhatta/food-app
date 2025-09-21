import { Document } from 'mongoose';
import { ValidationError } from "../utils/Error";

// Payload for JWT token
export interface VendorPayload {
  _id: string;
  email: string;
  name: string;
  ownerName: string;
  foodType: string;
  role: 'vendor';
  serviceAvailable: boolean;
}

// For creating a new vendor
export class CreateVendorDTO {
  name: string;
  ownerName: string;
  foodType: string;
  pincode: string;
  address: string;
  phone: string;
  email: string;
  password: string;

  constructor(data: any) {
    this.name = data?.name;
    this.address = data?.address;
    this.pincode = data?.pincode;
    this.foodType = data?.foodType;
    this.email = data?.email;
    this.password = data?.password;
    this.ownerName = data?.ownerName;
    this.phone = data?.phone;

    this.validate();
  }

  private validate(): void {
    const errors: string[] = [];

    // Validate name
    if (
      !this.name ||
      typeof this.name !== "string" ||
      this.name.trim().length === 0
    ) {
      errors.push("Name is required and must be a non-empty string");
    } else if (this.name.trim().length < 2) {
      errors.push("Name must be at least 2 characters long");
    } else if (this.name.trim().length > 100) {
      errors.push("Name must not exceed 100 characters");
    }

    // Validate address
    if (
      !this.address ||
      typeof this.address !== "string" ||
      this.address.trim().length === 0
    ) {
      errors.push("Address is required and must be a non-empty string");
    } else if (this.address.trim().length < 10) {
      errors.push("Address must be at least 10 characters long");
    } else if (this.address.trim().length > 500) {
      errors.push("Address must not exceed 500 characters");
    }

    // Validate pincode
    if (!this.pincode || typeof this.pincode !== "string") {
      errors.push("Pincode is required");
    } else if (!/^\d{6}$/.test(this.pincode)) {
      errors.push("Pincode must be exactly 6 digits");
    }

    // Validate foodType
    if (
      !this.foodType ||
      typeof this.foodType !== "string" ||
      this.foodType.trim().length === 0
    ) {
      errors.push("Food type is required");
    } else {
      const validFoodTypes = ["veg", "non-veg", "both"];
      if (!validFoodTypes.includes(this.foodType.toLowerCase())) {
        errors.push("Food type must be one of: veg, non-veg, both");
      }
    }

    // Validate email
    if (!this.email || typeof this.email !== "string") {
      errors.push("Email is required");
    } else if (!this.isValidEmail(this.email)) {
      errors.push("Please provide a valid email address");
    }

    // Validate password
    if (!this.password || typeof this.password !== "string") {
      errors.push("Password is required");
    } else if (this.password.length < 6) {
      errors.push("Password must be at least 6 characters long");
    } else if (this.password.length > 128) {
      errors.push("Password must not exceed 128 characters");
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(this.password)) {
      errors.push(
        "Password must contain at least one lowercase letter, one uppercase letter, and one number"
      );
    }

    // Validate owner name
    if (
      !this.ownerName ||
      typeof this.ownerName !== "string" ||
      this.ownerName.trim().length === 0
    ) {
      errors.push("Owner name is required and must be a non-empty string");
    } else if (this.ownerName.trim().length < 2) {
      errors.push("Owner name must be at least 2 characters long");
    } else if (this.ownerName.trim().length > 100) {
      errors.push("Owner name must not exceed 100 characters");
    }

    // Validate phone
    if (!this.phone || typeof this.phone !== "string") {
      errors.push("Phone number is required");
    } else if (!this.isValidPhone(this.phone)) {
      errors.push("Phone number must be exactly 10 digits");
    }

    if (errors.length > 0) {
      throw new ValidationError("Validation failed", errors);
    }

    // Clean up the data
    this.name = this.name.trim();
    this.address = this.address.trim();
    this.ownerName = this.ownerName.trim();
    this.email = this.email.toLowerCase().trim();
    this.foodType = this.foodType.toLowerCase();
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email.trim());
  }

  private isValidPhone(phone: string): boolean {
    const phoneRegex = /^\d{10}$/;
    return phoneRegex.test(phone.replace(/\D/g, ""));
  }
}

// Response DTO for vendor data
export class VendorResponseDTO {
  id: string;
  name: string;
  email: string;
  ownerName: string;
  phone: string;
  address: string;
  pincode: string;
  foodType: string;
  rating: number;
  serviceAvailable: boolean;
  createdAt?: Date;
  updatedAt?: Date;

  constructor(vendor: any) {
    this.id = vendor._id?.toString() || vendor.id;
    this.name = vendor.name;
    this.email = vendor.email;
    this.ownerName = vendor.ownerName;
    this.phone = vendor.phone;
    this.address = vendor.address;
    this.pincode = vendor.pincode;
    this.foodType = vendor.foodType;
    this.rating = vendor.rating || 0;
    this.serviceAvailable = vendor.serviceAvailable || false;
    this.createdAt = vendor.createdAt;
    this.updatedAt = vendor.updatedAt;
  }
}

// For updating vendor data
export class UpdateVendorDTO {
  name?: string;
  address?: string;
  pincode?: string;
  foodType?: string;
  ownerName?: string;
  phone?: string;
  serviceAvailable?: boolean;

  constructor(data: any) {
    if (data.name !== undefined) this.name = data.name;
    if (data.address !== undefined) this.address = data.address;
    if (data.pincode !== undefined) this.pincode = data.pincode;
    if (data.foodType !== undefined) this.foodType = data.foodType;
    if (data.ownerName !== undefined) this.ownerName = data.ownerName;
    if (data.phone !== undefined) this.phone = data.phone;
    if (data.serviceAvailable !== undefined)
      this.serviceAvailable = data.serviceAvailable;

    this.validate();
  }

  private validate(): void {
    const errors: string[] = [];

    if (this.name !== undefined) {
      if (typeof this.name !== "string" || this.name.trim().length === 0) {
        errors.push("Name must be a non-empty string");
      } else if (this.name.trim().length < 2 || this.name.trim().length > 100) {
        errors.push("Name must be between 2 and 100 characters");
      }
    }

    if (this.address !== undefined) {
      if (
        typeof this.address !== "string" ||
        this.address.trim().length === 0
      ) {
        errors.push("Address must be a non-empty string");
      } else if (
        this.address.trim().length < 10 ||
        this.address.trim().length > 500
      ) {
        errors.push("Address must be between 10 and 500 characters");
      }
    }

    if (this.pincode !== undefined) {
      if (typeof this.pincode !== "string" || !/^\d{6}$/.test(this.pincode)) {
        errors.push("Pincode must be exactly 6 digits");
      }
    }

    if (this.foodType !== undefined) {
      if (typeof this.foodType !== "string") {
        errors.push("Food type must be a string");
      } else {
        const validFoodTypes = ["veg", "non-veg", "both"];
        if (!validFoodTypes.includes(this.foodType.toLowerCase())) {
          errors.push("Food type must be one of: veg, non-veg, both");
        }
      }
    }

    if (this.ownerName !== undefined) {
      if (
        typeof this.ownerName !== "string" ||
        this.ownerName.trim().length === 0
      ) {
        errors.push("Owner name must be a non-empty string");
      } else if (
        this.ownerName.trim().length < 2 ||
        this.ownerName.trim().length > 100
      ) {
        errors.push("Owner name must be between 2 and 100 characters");
      }
    }

    if (this.phone !== undefined) {
      if (
        typeof this.phone !== "string" ||
        !/^\d{10}$/.test(this.phone.replace(/\D/g, ""))
      ) {
        errors.push("Phone number must be exactly 10 digits");
      }
    }

    if (
      this.serviceAvailable !== undefined &&
      typeof this.serviceAvailable !== "boolean"
    ) {
      errors.push("Service available must be a boolean value");
    }

    if (errors.length > 0) {
      throw new ValidationError("Validation failed", errors);
    }

    // Clean up the data
    if (this.name) this.name = this.name.trim();
    if (this.address) this.address = this.address.trim();
    if (this.ownerName) this.ownerName = this.ownerName.trim();
    if (this.foodType) this.foodType = this.foodType.toLowerCase();
  }
}
