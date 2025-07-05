import { Request, Response, NextFunction, request } from "express";
import { CreateVendorInput } from "../dto";

export const CreateVendor = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { name, pincode, foodType, email, password, ownerName, phone } = <
    CreateVendorInput
  >req.body;

  res.json({
    name,
    pincode,
    foodType,
    email,
    password,
    ownerName,
    phone,
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
