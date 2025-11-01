// Payload for JWT token
export interface CustomerPayload {
  _id: string;
  email: string;
  verified: boolean;
  role: "customer";
}

// Signup DTO
export class CreateCustomerDTO {
  email: string;
  password: string;
  phone: string;

  constructor(data: any) {
    this.email = data?.email;
    this.password = data?.password;
    this.phone = data?.phone;
  }
}

// Login DTO
export class CustomerLoginDTO {
  email?: string;
  phone?: string;
  password: string;

  constructor(data: any) {
    this.email = data?.email;
    this.phone = data?.phone;
    this.password = data?.password;
  }
}

// Edit profile DTO
export class EditCustomerProfileInputs {
  firstName?: string;
  lastName?: string;
  address?: string;

  constructor(data: any) {
    if (data?.firstName !== undefined) this.firstName = data.firstName;
    if (data?.lastName !== undefined) this.lastName = data.lastName;
    if (data?.address !== undefined) this.address = data.address;
  }
}

// Order related DTO
export class OrderInputs {
  _id: string;
  unit: number;
}
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
