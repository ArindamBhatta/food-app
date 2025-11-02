import { ControllerPayload } from "../../../constants";
import { AuthPayload } from "../../dto/Auth.dto";
import {
  EditVendorProfileDTO,
  LoginVendorDTO,
  VendorResponseDTO,
} from "../../dto/interface/Vendor.dto";
import { CreateFoodInput, FoodResponse } from "../../dto/interface/Food.dto";
import FoodService from "../../services/FoodService/FoodService";
import { VendorDoc } from "../../entities";
import VendorService from "../../services/VendorService/VendorService";
import { LoginResponse } from "../../services/VendorService/VendorService.interface";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../../utils/auth.utility";
import IVendorController from "./VendorController.interface";

export default class VendorController implements IVendorController {
  private vendorService: VendorService;
  private foodService: FoodService;
  constructor(vendorService: VendorService, foodService: FoodService) {
    this.vendorService = vendorService;
    this.foodService = foodService;
  }

  vendorLogin = async (payload: ControllerPayload) => {
    try {
      const loginVendor: LoginVendorDTO = new LoginVendorDTO(payload.req.body);
      const loginResponse: LoginResponse = await this.vendorService.vendorLogin(
        loginVendor
      );
      payload.res.cookie("refreshToken", loginResponse.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });
      const vendorResponse = new VendorResponseDTO(loginResponse.vendor);
      return payload.res.status(200).json({
        success: true,
        message: "Login successful",
        vendor: vendorResponse,
        accessToken: loginResponse.accessToken,
      });
    } catch (error: any) {
      console.error("Error in vendorLogin:", error);
      return payload.res.status(500).json({
        success: false,
        message: error.message || "Login failed",
        details: error.stack,
      });
    }
  };

  refreshTokenRegenerate = async (payload: ControllerPayload) => {
    try {
      // 1. Get refresh token from cookies
      const oldRefreshToken = payload.req.cookies?.refreshToken;
      if (!oldRefreshToken) {
        return payload.res
          .status(401)
          .json({ success: false, message: "No refresh token provided" });
      }

      // 2. Verify old refresh token
      const payloadData = verifyRefreshToken(oldRefreshToken);
      if (!payloadData || !payloadData._id || payloadData.role !== "vendor") {
        return payload.res.status(401).json({
          success: false,
          message: "Invalid or expired refresh token",
        });
      }

      // 3. Find vendor by ID
      const vendor = await this.vendorService.vendorProfile(payloadData._id);
      if (!vendor) {
        return payload.res
          .status(404)
          .json({ success: false, message: "Vendor not found" });
      }

      // 4. Generate new tokens
      const newRefreshToken: string = generateRefreshToken(payloadData);
      const newAccessToken: string = generateAccessToken(payloadData);

      //5. save new access token to database
      await this.vendorService.updateRefreshToken(
        payloadData._id,
        newRefreshToken
      );

      // 5. Set new refresh token in cookie
      payload.res.cookie("refreshToken", newRefreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      // 6. Respond with new tokens
      return payload.res.status(200).json({
        success: true,
        message: "Refresh token regenerated",
        accessToken: newAccessToken,
      });
    } catch (error) {
      console.error("Error in refreshTokenRegenerate:", error);
      return payload.res.status(500).json({
        success: false,
        message: "Failed to regenerate refresh token",
        details: (error as Error).message,
      });
    }
  };

  vendorProfile = async (payload: ControllerPayload) => {
    try {
      const user: AuthPayload | undefined = payload.req.user;
      if (!user) {
        return payload.res.status(401).json({
          success: false,
          message: `User not found ${user}`,
        });
      }
      const existingVendor: VendorDoc | null =
        await this.vendorService.vendorProfile(user._id?.toString());
      if (!existingVendor) {
        return payload.res.status(404).json({
          success: false,
          message: "Vendor not found",
        });
      }
      return payload.res.status(200).json({
        success: true,
        vendor: existingVendor,
        message: "Vendor profile fetched successfully",
      });
    } catch (error: any) {
      console.error("Error in vendorProfile:", error);
      return payload.res.status(500).json({
        success: false,
        message: error.message || "Internal server error",
      });
    }
  };

  updateVendorProfile = async (payload: ControllerPayload) => {
    try {
      const EditVendorProfile: EditVendorProfileDTO = new EditVendorProfileDTO(
        payload.req.body
      );
      const user: AuthPayload | undefined = payload.req.user;
      if (!user) {
        return payload.res.status(401).json({
          success: false,
          message: "User not authenticated",
        });
      }
      const updatedVendor = await this.vendorService.updateVendorProfile(
        user._id?.toString(),
        EditVendorProfile
      );
      if (!updatedVendor) {
        return payload.res.status(404).json({
          success: false,
          message: "Vendor not found",
        });
      }
      return payload.res.status(200).json({
        success: true,
        vendor: new VendorResponseDTO(updatedVendor),
        message: "Vendor profile updated successfully",
      });
    } catch (error: any) {
      console.error("Error in updateProfile:", error);
      return payload.res.status(500).json({
        success: false,
        message: "Internal server error",
        details: error.message,
      });
    }
  };

  updateShopImage = async (payload: ControllerPayload) => {
    try {
      const user: AuthPayload | undefined = payload.req.user;
      if (!user) {
        return payload.res.status(401).json({
          success: false,
          message: "User not authenticated",
        });
      }
      const file: Express.Multer.File | undefined = payload.req.file;
      if (!file) {
        return payload.res.status(400).json({
          success: false,
          message: "No file uploaded",
        });
      }
      const updatedVendor = await this.vendorService.updateShopImage(
        user._id?.toString(),
        file
      );
      if (!updatedVendor) {
        return payload.res.status(404).json({
          success: false,
          message: "Vendor not found",
        });
      }
      return payload.res.status(200).json({
        success: true,
        vendor: new VendorResponseDTO(updatedVendor),
        message: "Vendor profile updated successfully",
      });
    } catch (error: any) {
      console.error("Error in updateShopImage:", error);
      return payload.res.status(500).json({
        success: false,
        message: "Internal server error",
        details: error.message,
      });
    }
  };
  //TODO: implement this
  updateVendorService = async (payload: ControllerPayload) => {
    try {
    } catch (error) {
      console.error("Error in updateVendorService:", error);
      throw error;
    }
  };

  vendorAddFoods = async (payload: ControllerPayload) => {
    try {
      const user: AuthPayload | undefined = payload.req.user;
      if (!user) {
        return payload.res.status(401).json({
          success: false,
          message: "User not authenticated",
        });
      }

      const files = payload.req.files as Express.Multer.File[];
      const createFoodInput: CreateFoodInput = new CreateFoodInput(
        payload.req.body
      );

      const createdFood = await this.foodService.addFood(
        user._id?.toString() as string,
        createFoodInput,
        files || []
      );

      const foodResponse: FoodResponse = {
        id: createdFood.id,
        name: createdFood.name,
        description: createdFood.description,
        category: createdFood.category,
        foodType: createdFood.foodType,
        readyTime: createdFood.readyTime,
        price: createdFood.price,
        rating: createdFood.rating,
        images: (createdFood.images as unknown as string[]) || [],
      };

      return payload.res.status(201).json({
        success: true,
        food: foodResponse,
        message: "Food added successfully",
      });
    } catch (error: any) {
      console.error("Error in vendorAddFoods:", error);
      return payload.res.status(500).json({
        success: false,
        message: "Internal server error",
        details: error.message,
      });
    }
  };

  fetchAllFood = async (payload: ControllerPayload) => {
    try {
      const user: AuthPayload | undefined = payload.req.user;
      if (!user) {
        return payload.res.status(401).json({
          success: false,
          message: "User not authenticated",
        });
      }

      const foods = await this.foodService.getFoods(
        user._id?.toString() as string
      );

      return payload.res.status(200).json({
        success: true,
        foods,
        message: "Foods fetched successfully",
      });
    } catch (error: any) {
      console.error("Error in fetchAllFood:", error);
      return payload.res.status(500).json({
        success: false,
        message: "Internal server error",
        details: error.message,
      });
    }
  };

  getCurrentOrder = async (payload: ControllerPayload) => {
    throw new Error("Method not implemented");
  };

  getOrderDetails = async (payload: ControllerPayload) => {
    throw new Error("Method not implemented");
  };

  processOrder = (payload: ControllerPayload) => {
    throw new Error("Method not implemented");
  };
}
