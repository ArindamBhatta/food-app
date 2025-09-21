import { IsEmail, IsPhoneNumber, Length } from "class-validator";
import { Document } from 'mongoose';

// Payload for JWT token
export interface CustomerPayload {
  _id: string;
  email: string;
  verified: boolean;
  role: 'customer';
}

// Signup DTO
export class CreateCustomerInput {
  @IsEmail()
  email: string;

  @Length(6, 20)
  password: string;

  @IsPhoneNumber("IN")
  phone: string;

  // Additional fields can be added here
  [key: string]: any;
}

// Login DTO
export class UserLoginInputs {
  @IsEmail()
  email: string;

  @Length(6, 20)
  password: string;
}

// Edit profile DTO
export class EditCustomerProfileInputs {
  @Length(3, 20)
  firstName: string;
  
  @Length(3, 20)
  lastName: string;
  
  @Length(10, 100)
  address: string;
}

// Order related DTO
export class OrderInputs {
  _id: string;
  unit: number;
}

// For MongoDB document
export interface ICustomer extends Document {
  email: string;
  password: string;
  salt: string;
  phone: string;
  firstName: string;
  lastName: string;
  address: string;
  verified: boolean;
  otp: number;
  otp_expiry: Date;
  lat: number;
  lng: number;
  cart: any[];
  orders: any[];
  
  comparePassword(password: string): Promise<boolean>;
  generateToken(): string;
  generatePasswordResetToken(): string;
}

// Response DTO for customer data
export class CustomerResponseDTO {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  verified: boolean;
  address: string;
  lat?: number;
  lng?: number;
  orders: any[];
  cart: any[];
  createdAt?: Date;
  updatedAt?: Date;

  constructor(customer: any) {
    this.id = customer._id?.toString() || customer.id;
    this.email = customer.email;
    this.firstName = customer.firstName;
    this.lastName = customer.lastName;
    this.phone = customer.phone;
    this.verified = customer.verified || false;
    this.address = customer.address;
    this.lat = customer.lat;
    this.lng = customer.lng;
    this.orders = customer.orders || [];
    this.cart = customer.cart || [];
    this.createdAt = customer.createdAt;
    this.updatedAt = customer.updatedAt;
  }
}

// For updating customer data
export class UpdateCustomerDTO {
  firstName?: string;
  lastName?: string;
  phone?: string;
  address?: string;
  lat?: number;
  lng?: number;

  constructor(data: any) {
    if (data.firstName !== undefined) this.firstName = data.firstName;
    if (data.lastName !== undefined) this.lastName = data.lastName;
    if (data.phone !== undefined) this.phone = data.phone;
    if (data.address !== undefined) this.address = data.address;
    if (data.lat !== undefined) this.lat = data.lat;
    if (data.lng !== undefined) this.lng = data.lng;
  }
}
