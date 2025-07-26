import { Request, Response } from "express";
import { EditVendorInputs, VendorLoginInputs, VendorPayload } from "../dto";
import { FindVendor } from "./AdminController";
import { GenerateSignature, ValidatePassword } from "../utility";
import { CreateFoodInput } from "../dto/Food.dto";
import { Food } from "../models/Food";

export const VendorLogin = async (req: Request, res: Response) => {
  const { email, password } = <VendorLoginInputs>req.body;
  //find vendor from database
  const existingVendor = await FindVendor(undefined, email);

  // encrypt password
  if (existingVendor !== null) {
    const validation = await ValidatePassword(
      password,
      existingVendor.password,
      existingVendor.salt
    );
    //get access token
    if (validation) {
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

export const AddFood = async (req: Request, res: Response) => {
  const user = req.user;

  if (user) {
    const { name, description, category, foodType, readyTime, price } = <
      CreateFoodInput
    >req.body;

    const vendor = await FindVendor(user._id);
    //food created
    if (vendor !== null) {
      const createdFood = await Food.create({
        vendorId: vendor._id,
        name: name,
        description: description,
        category: category,
        foodType: foodType,
        readyTime: readyTime,
        images: ["mock.jpg"],
        price: price,
        rating: 0,
      });
      //push the food to vendor
      vendor.foods.push(createdFood);
      const result = await vendor.save();
      return res.json(result);
    }
  }

  return res.json({ message: "Something went wrong with foods" });
};
export const getFood = () => {};
