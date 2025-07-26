import { Request, Response, NextFunction } from "express";
import { CreateVendorInput } from "../dto";
import { Vendor, VendorDoc } from "../models";
import { GeneratedSalt, GeneratePassword } from "../utility";

//global method to fetch a particular vendor
export const FindVendor = async (
  id?: string,
  email?: string
): Promise<VendorDoc | null> => {
  if (email) {
    return await Vendor.findOne({ email: email });
  } else {
    return await Vendor.findById(id);
  }
};

// create a new Vendor. using mongoDB create method
export const CreateVendor = async (req: Request, res: Response) => {
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

  const existingVendor = await FindVendor(undefined, email);

  if (existingVendor !== null) {
    return res
      .status(404)
      .json({ message: "A vendor is exist with this email ID" });
  }

  //generate a salt
  const salt = await GeneratedSalt();

  const encryptedPassword = await GeneratePassword(password, salt);

  const CreateVendorInDB = await Vendor.create({
    name: name,
    address: address,
    pincode: pincode,
    foodType: foodType,
    email: email,
    password: encryptedPassword,
    salt: salt,
    ownerName: ownerName,
    phone: phone,
    rating: 0,
    serviceAvailable: false,
    coverImages: [],
  });

  //create a response message for user
  res.status(201).json({
    success: true,
    message: "Vendor created successfully!",
    data: {
      id: CreateVendorInDB._id,
      name: CreateVendorInDB.name,
      email: CreateVendorInDB.email,
      ownerName: CreateVendorInDB.ownerName,
      phone: CreateVendorInDB.phone,
      address: CreateVendorInDB.address,
      pincode: CreateVendorInDB.pincode,
      foodType: CreateVendorInDB.foodType,
      rating: CreateVendorInDB.rating,
      serviceAvailable: CreateVendorInDB.serviceAvailable,
    },
  });
};

//get all vendor using mongoDB find method
export const getAllVendors = async (res: Response) => {
  const vendor = await Vendor.find();

  if (vendor !== null) {
    return res.json(vendor);
  }

  res.json({ message: "vendors data not available" });
};

//get a particular vendor using mongoDB findById method
export const getVendorById = async (req: Request, res: Response) => {
  const vendorId: string = req.params.id;

  const vendor = await Vendor.findById(vendorId);

  if (vendor !== null) {
    return res.json(vendor);
  }

  res.json({ message: "Vendor Data is not available" });
};
