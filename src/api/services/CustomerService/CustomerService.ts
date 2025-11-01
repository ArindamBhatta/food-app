import {
  CreateCustomerDTO,
  EditCustomerProfileInputs,
} from "../../dto/interface/Customer.dto";
import { CustomerDoc } from "../../entities/Customer";
import ICustomerService from "./CustomerService.interface";
import CustomerRepo from "../../repos/CustomerRepo/CustomerRepo";
import {
  generateAccessToken,
  generateSalt,
  hashPassword,
  verifyPassword,
} from "../../utils/auth.utility";
import { GenerateOpt } from "../../utils/OtpValidation.utility";
import { Types } from "mongoose";

export default class CustomerService implements ICustomerService {
  private customerRepo: CustomerRepo;

  constructor(customerRepo: CustomerRepo) {
    this.customerRepo = customerRepo;
  }

  signUp = async (
    input: CreateCustomerDTO
  ): Promise<{ customer: CustomerDoc; otp: number }> => {
    //Hash password with salt
    const salt = await generateSalt();
    const hashedPassword = await hashPassword(input.password, salt);

    // Step 1: Check duplicate customer already exists
    const existing = await this.customerRepo.existingCustomer(input.email);
    if (existing) throw new Error("Customer already exists");

    // Step 2: Generate OTP
    const { otp, expiry } = GenerateOpt();

    // Step 4: Save customer
    const customer = await this.customerRepo.createCustomer({
      email: input.email,
      password: hashedPassword,
      salt,
      phone: input.phone,
      otp,
      otp_expiry: expiry,
      firstName: "",
      lastName: "",
      address: "",
      verified: false,
      lat: 0,
      lng: 0,
      orders: [],
    });

    return { customer, otp };
  };

  verifyOtp = async (
    otp: number,
    email?: string,
    phone?: string,
    customerId?: string
  ) => {
    const customer = await this.customerRepo.verifyOtp(otp, email, phone, customerId);
    if (!customer) return { customer: null };
    const signature = generateAccessToken({
      _id: (customer._id as Types.ObjectId).toString(),
      email: customer.email,
      verified: customer.verified,
      role: "customer",
    });
    return { customer, signature };
  };

  signIn = async (email: string, password: string) => {
    const customer = await this.customerRepo.existingCustomer(email);
    if (!customer) return null;
    const isPasswordValid = await verifyPassword(
      password,
      customer.password,
      customer.salt
    );
    if (!isPasswordValid) return null;
    const signature = generateAccessToken({
      _id: (customer._id as Types.ObjectId).toString(),
      email: customer.email,
      verified: customer.verified,
      role: "customer",
    });
    return { customer, signature };
  };

  requestOtp = async (email: string) => {
    const customer = await this.customerRepo.existingCustomer(email);
    if (!customer) return null;
    const { otp, expiry } = GenerateOpt();
    customer.otp = otp;
    customer.otp_expiry = expiry;
    await customer.save();
    return { customer };
  };

  updateProfile = async (
    customerId: string,
    input: EditCustomerProfileInputs
  ) => {
    const customer = await this.customerRepo.existingCustomer(customerId);
    if (!customer) return null;
    customer.firstName = input.firstName || customer.firstName;
    customer.lastName = input.lastName || customer.lastName;
    customer.address = input.address || customer.address;
    await customer.save();
    return customer;
  };
}
