import { ControllerPayload } from "../../../constants";
import { AuthPayload } from "../../dto/Auth.dto";
import {
  EditVendorProfileDTO,
  LoginVendorDTO,
  VendorResponseDTO,
} from "../../dto/interface/Vendor.dto";
import { VendorDoc } from "../../entities";
import VendorService from "../../services/VendorService/VendorService";
import { LoginResponse } from "../../services/VendorService/VendorService.interface";
import IVendorController from "./VendorController.interface";

export default class VendorController implements IVendorController {
  private vendorService: VendorService;
  constructor(vendorService: VendorService) {
    this.vendorService = vendorService;
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
    } catch (error) {
      console.error("Error in refreshTokenRegenerate:", error);
      throw error;
    }
  };

  //
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

  updateOwnerProfile = async (payload: ControllerPayload) => {
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
      const updatedVendor = await this.vendorService.updateOwnerProfile(
        EditVendorProfile,
        user._id?.toString()
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

  updateVendorService = async (payload: ControllerPayload) => {
    try {
    } catch (error) {
      console.error("Error in updateVendorService:", error);
      throw error;
    }
  };

  vendorAddFoods = async (payload: ControllerPayload) => {
    try {
    } catch (error) {
      console.error("Error in vendorAddFoods:", error);
      throw error;
    }
  };

  fetchAllFood = async (payload: ControllerPayload) => {
    try {
    } catch (error) {
      console.error("Error in fetchAllFood:", error);
      throw error;
    }
  };

  getCurrentOrder = (payload: any) => {
    throw new Error("Method not implemented");
  };

  getOrderDetails = (payload: any) => {
    throw new Error("Method not implemented");
  };

  processOrder = (payload: any) => {
    throw new Error("Method not implemented");
  };
}
