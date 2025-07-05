import { Request, Response, NextFunction, request } from "express";
import { CreateVendorInput } from "../dto";
import { Vendor } from "../models";

export const CreateVendor = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const {
    name,
    address,
    pincode,
    foodType,
    email,
    password,
    ownerName,
    phone,
  } = <CreateVendorInput>req.body;

  const CreateVendor = await Vendor.create({
    name: name,
    address: address,
    pincode: pincode,
    foodType: foodType,
    email: email,
    password: password,
    salt: "",
    ownerName: ownerName,
    phone: phone,
    rating: 0,
    serviceAvailable: false,
    coverImages: [],
  });
};

export const getVendor = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.json({ message: "Get all vendors" });
};

export const getVendorById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  res.json({ message: `Get vendor by ID: ${id}` });
};
