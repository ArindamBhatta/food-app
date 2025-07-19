import { NextFunction, Request, Response } from "express";
import { VendorLoginInput, VendorPayload } from "../dto";
import { FindVendor } from "./AdminController";
import { GenerateSignature, ValidatePassword } from "../utility";
import jwt from "jsonwebtoken";
import { API_SECRET } from "../config";

export const VendorLogin = async (req: Request, res: Response) => {
  const { email, password } = <VendorLoginInput>req.body;

  const existingVendor = await FindVendor(undefined, email);
  if (existingVendor !== null) {
    const validation = await ValidatePassword(
      password,
      existingVendor.password,
      existingVendor.salt
    );

    if (validation) {
      //access for playing football
      const signature = GenerateSignature({
        _id: existingVendor.id,
        email: existingVendor.email,
        name: existingVendor.name,
        foodTypes: existingVendor.foodType,
      });
      return res.json(signature);
    } else {
      return res.json({ message: "Password is not valid" });
    }
  } else {
    return res.json({ message: "Login Credential is not valid" });
  }
};

export const GetVendorProfile = async (req: Request, res: Response) => {
  const user = req.user;

  if (user) {
    const existingVendor = await FindVendor(user._id);
    return res.json(existingVendor);
  }
  return res.json({ message: "Vendor information not found" });
};

export const UpdateVendorProfile = async (req: Request, res: Response) => {
  // const {} = req.body;
  // const user = req.user;
  // if (user) {
  //   const existingVendor = await FindVendor(user._id);
  //   return res.json(existingVendor);
  // }
};
export const GetVendorService = async (req: Request, res: Response) => {};
