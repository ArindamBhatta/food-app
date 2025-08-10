import { Request, Response, NextFunction } from "express";
import { CreateVendorInput } from "../src/dto";
import { Vendor, VendorDoc } from "../src/models";
import { GeneratedSalt, GeneratePassword } from "../src/utility";

//return Promise<VendorDoc | null>

export const FindVendor: Function = async (
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
export const CreateVendor: Function = async (req: Request, res: Response) => {
  // const name = req.body.name;
  //Destructuring = L.H.S(Destructuring) = R.H.S(Assigning)
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

  const existingVendor: VendorDoc | null = await FindVendor(undefined, email);

  if (existingVendor !== null) {
    return res
      .status(404)
      .json({ message: "A vendor is exist with this email ID" });
  }

  //generate a random string
  const salt: string = await GeneratedSalt();

  // generate a password
  const encryptedPassword = await GeneratePassword(password, salt);

  //create a vendor in database
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
    foods: [],
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
export const getAllVendors = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
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
