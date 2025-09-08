import { NextFunction, Request, Response } from "express";
import { EditVendorInputs, VendorLoginInputs, VendorPayload } from "../dto";
import { FindVendor } from "./AdminController";
import { GenerateSignature, ValidatePassword } from "../utility";
import { CreateFoodInput } from "../dto/Food.dto";
import { Food, FoodDoc } from "../models/Food";
import { AuthPayload } from "../dto/Auth.dto";
import { VendorDoc } from "../models";
import { Order } from "../models/Order";

//if a user login token is generate and send to frontend
export const VendorLogin = async (req: Request, res: Response) => {
  const { email, password } = <VendorLoginInputs>req.body;
  //find vendor from database
  const existingVendor = await FindVendor(undefined, email);

  //decrypt password
  if (existingVendor !== null) {
    const validation: boolean = await ValidatePassword(
      password,
      existingVendor.password,
      existingVendor.salt
    );

    //get the access token
    if (validation) {
      const signature: string = GenerateSignature({
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

//frontend send the token, verify the token
export const GetVendorProfile = async (req: Request, res: Response) => {
  const user: AuthPayload | undefined = req.user;

  if (user) {
    const existingVendor: VendorDoc = await FindVendor(user._id);
    return res.json(existingVendor);
  }
  return res.json({ message: "Vendor information not found" });
};

export const UpdateVendorProfile = async (req: Request, res: Response) => {
  const { name, address, phone, foodTypes } = <EditVendorInputs>req.body;
  const user: AuthPayload | undefined = req.user;
  if (user) {
    const existingVendor: VendorDoc = await FindVendor(user._id);

    if (existingVendor != null) {
      existingVendor.name = name;
      existingVendor.address = address;
      existingVendor.phone = phone;
      existingVendor.foodType = foodTypes;

      const saveResult: VendorDoc = await existingVendor.save();
      return res.json(saveResult);
    }
    return res.json({ message: "Vendor Information not found" });
  }
};

export const UpdateVendorCoverImage = async (req: Request, res: Response) => {
  const user = req.user;
  if (user) {
    const existingVendor: VendorDoc = await FindVendor(user._id);

    if (existingVendor) {
      const files = req.files as Express.Multer.File[];

      const images: string[] = files.map(
        (file: Express.Multer.File) => file.filename
      );

      existingVendor.coverImages.push(...images);

      const result: VendorDoc = await existingVendor.save();

      return res.json(result);
    }
  }
};

export const UpdateVendorService = async (req: Request, res: Response) => {
  const user: AuthPayload | undefined = req.user;
  if (user) {
    const existingVendor: VendorDoc = await FindVendor(user._id);

    if (existingVendor !== null) {
      existingVendor.serviceAvailable = !existingVendor.serviceAvailable;
      // save method is trigger
      const saveResult: VendorDoc = await existingVendor.save(); //hook

      return res.json(saveResult);
    }
    return res.json(existingVendor);
  }
  return res.json({ message: "Vendor information Not found" });
};

export const AddFood = async (req: Request, res: Response) => {
  const user: AuthPayload | undefined = req.user;

  if (user) {
    const { name, description, category, foodType, readyTime, price } = <
      CreateFoodInput
    >req.body;

    const vendor: VendorDoc = await FindVendor(user._id);

    //food created
    if (vendor !== null) {
      const file = req.files as Express.Multer.File[];

      const images: string[] = file.map(
        (file: Express.Multer.File) => file.filename
      );

      const createdFood: FoodDoc = await Food.create({
        vendorId: vendor._id,
        name: name,
        description: description,
        category: category,
        foodType: foodType,
        readyTime: readyTime,
        images: images,
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

export const getFood = async (req: Request, res: Response) => {
  const user: AuthPayload | undefined = req.user;

  if (user) {
    const foods = await Food.find({ vendorId: user._id });
    if (foods !== null) {
      return res.json(foods);
    }
    return res.json({ message: "Foods information not found" });
  }
};

// ---

export const GetCurrentOrder = async (req: Request, res: Response) => {
  const user = req.user;
  if (user) {
    const orders = await Order.find({ vendorId: user._id }).populate(
      "items.food"
    );

    if (orders !== null) {
      return res.status(200).json(orders);
    }
  }
  return res.status(404).json({ message: "Orders not found" });
};

export const GetOrderDetails = async (req: Request, res: Response) => {
  const orderId = req.params.id;
  if (orderId) {
    const order = await Order.findById({ orderID: orderId }).populate(
      "items.food"
    );

    if (order !== null) {
      return res.status(200).json(order);
    }
  }
  return res.status(404).json({ message: "Orders not found" });
};
export const ProcessOrder = async (req: Request, res: Response) => {};
