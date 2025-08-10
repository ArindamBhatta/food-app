import express, { Request, Response, NextFunction } from "express";
import { Vendor, VendorDoc } from "../models";
import { FoodDoc } from "../models/Food";

export const GetFoodAvailability = async (req: Request, res: Response) => {
  const pincode: string = req.params.pincode;

  const result = await Vendor.find({
    pincode: pincode,
    serviceAvailable: false, //mark it true
  })
    .sort([["rating", "descending"]])
    .populate("foods"); //fetch the reference data

  if (result.length > 0) {
    res.json(result);
  } else {
    res.status(400).json({ message: "No Vendor Found in this Area" });
  }
};

export const GetTopRestaurants = async (req: Request, res: Response) => {
  const pincode: string = req.params.pincode;

  const result = await Vendor.find({
    pincode: pincode,
    serviceAvailable: false, //mark it true
  })
    .sort([["rating", "descending"]])
    .limit(10);

  if (result.length > 0) {
    res.json(result);
  } else {
    res.status(400).json({ message: "No Vendor Found in this Area" });
  }
};

export const GetFoodsIn30Min = async (req: Request, res: Response) => {
  const pincode: string = req.params.pincode;

  const result = await Vendor.find({
    pincode: pincode,
    serviceAvailable: false,
  }).populate("foods");

  if (result.length > 0) {
    let foodResult: any = [];

    result.map((vendor: VendorDoc) => {
      const foods: FoodDoc[] = vendor.foods as [FoodDoc];

      foodResult.push(...foods.filter((food) => food.readyTime <= 30));

      return res.status(200).json(foodResult);
    });
  } else {
    res.status(400).json({ message: "No Vendor Found in this Area" });
  }
};

export const SearchFoods = async (req: Request, res: Response) => {
  const pincode: string = req.params.pincode;
  const result = await Vendor.find({
    pincode: pincode,
    serviceAvailable: false,
  }).populate("foods");

  if (result.length > 0) {
    let foodResult: any = [];

    result.map((vendor: VendorDoc) => {
      const foods: FoodDoc[] = vendor.foods as [FoodDoc];

      foodResult.push(...foods.filter((food) => food.name == req.body.name));

      return res.status(200).json(foodResult);
    });
  } else {
    return res.status(400).json({ message: "No Vendor Found in this Area" });
  }
};

export const RestaurantById = async (req: Request, res: Response) => {
  const id: string = req.params.id;

  const result = await Vendor.findById(id).populate("foods");

  if (result) {
    return res.status(200).json(result);
  } else {
    res.status(400).json({ message: "No Vendor Found in this Area" });
  }
};
