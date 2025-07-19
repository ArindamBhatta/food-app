import { NextFunction, Request, Response } from "express";
import { EditVendorInputs, VendorLoginInputs, VendorPayload } from "../dto";
import { FindVendor } from "./AdminController";
import { GenerateSignature, ValidatePassword } from "../utility";

export const VendorLogin = async (req: Request, res: Response) => {
  const { email, password } = <VendorLoginInputs>req.body;

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
  const { name, address, phone, foodTypes } = <EditVendorInputs>req.body;
  const user = req.user;
  if (user) {
    const existingVendor = await FindVendor(user._id);
    if (existingVendor != null) {
      existingVendor.name = name;
      existingVendor.address = address;
      existingVendor.phone = phone;
      existingVendor.foodType = foodTypes;

      const saveResult = await existingVendor.save();
      return res.json(saveResult);
    }
    return res.json({ message: "Vendor Information not found" });
  }
};
export const UpdateVendorService = async (req: Request, res: Response) => {
  const user = req.user;
  if (user) {
    const existingVendor = await FindVendor(user._id);

    if (existingVendor !== null) {
      existingVendor.serviceAvailable = !existingVendor.serviceAvailable;
      const saveResult = await existingVendor.save();
      return res.json(saveResult);
    }
    return res.json(existingVendor);
  }
  return res.json({ message: "Vendor information Not found" });
};
