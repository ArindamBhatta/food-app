import e, { Request, Response, NextFunction } from "express";
import { validate } from "class-validator";
import { Types } from "mongoose";

import { plainToInstance } from "class-transformer";
import { CreateCustomerInput } from "../dto/Customer.dto";
import { GeneratedSalt, GeneratePassword, GenerateSignature } from "../utility";
import { GenerateOpt, onRequestOtp } from "../utility/NotificationUtility";
import { Customer, CustomerDoc } from "../models/Customer";

export const CustomerSignUp = async (req: Request, res: Response) => {
  try {
    console.log("Incoming request body:", req.body);

    // Step 1: Convert plain object to DTO instance
    const customerInputs = plainToInstance(CreateCustomerInput, req.body);

    // Step 2: Validate DTO instance
    const inputErrors = await validate(customerInputs, {
      whitelist: true,
      forbidNonWhitelisted: true,
      validationError: { target: false },
    });

    if (inputErrors.length > 0) {
      return res.status(400).json({
        message: "Validation failed",
        errors: inputErrors,
      });
    }

    // Step 3: Extract fields
    const { email, phone, password } = customerInputs;
    console.log("Validated input:", email, phone, password);

    // Step 4: Generate salt & hash password
    const salt = await GeneratedSalt();
    const hashedPassword = await GeneratePassword(password, salt);

    // Step 5: Generate OTP
    const { otp, expiry } = GenerateOpt();
    console.log("Generated OTP:", otp, expiry);

    const existingCustomer = await Customer.findOne({ email: email });

    if (existingCustomer) {
      return res.status(400).json({ message: "Customer already exists" });
    }

    // Step 6: Save customer
    const result: CustomerDoc = await Customer.create({
      email,
      password: hashedPassword,
      salt,
      phone,
      otp,
      otp_expiry: expiry,
      firstName: "",
      lastName: "",
      address: "",
      verified: false,
      lat: 0,
      lng: 0,
    });

    if (!result) {
      return res.status(400).json({ message: "Something went wrong" });
    }

    // Step 7: Send OTP
    await onRequestOtp(otp, phone);

    // Step 8: Generate JWT
    const signature: string = GenerateSignature({
      _id: (result._id as Types.ObjectId).toString(),
      email: result.email,
      verified: result.verified,
    });

    // Step 9: Send response
    res.status(201).json({
      signature,
      verified: result.verified,
      email: result.email,
    });
  } catch (error) {
    console.error("Customer signup error:", error);
    return res
      .status(500)
      .json({ message: "Internal server error during signup" });
  }
};

export const CustomerLogin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {};

export const CustomerVerify = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { otp } = req.body;
  const customer = req.user as CustomerDoc;

  if (customer) {
    const profile = await Customer.findById(customer._id);

    if (profile) {
      if (profile.otp === parseInt(otp) && profile.otp_expiry >= new Date()) {
        profile.verified = true;
        const updatedCustomer = await profile.save();

        const signature = GenerateSignature({
          _id: (updatedCustomer._id as Types.ObjectId).toString(),
          email: updatedCustomer.email,
          verified: updatedCustomer.verified,
        });

        return res.status(201).json({
          signature: signature,
          verified: updatedCustomer.verified,
          email: updatedCustomer.email,
        });
      } else {
        return res.status(400).json({ message: "Invalid OTP or Expired" });
      }
    }
  }
};

export const RequestOtp = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {};

export const getCustomerProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {};

export const EditCustomerProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {};
