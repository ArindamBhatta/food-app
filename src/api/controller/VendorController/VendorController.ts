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
      //Step 1: Extract and validate input (HTTP concern)
      const loginVendor: LoginVendorDTO = new LoginVendorDTO(payload.req.body);

      //Step 2: Call business logic layer (delegate to service)
      const loginResponse: LoginResponse = await this.vendorService.vendorLogin(
        loginVendor
      );

      // Set refresh token as secure HTTP-only cookie
      payload.res.cookie("refreshToken", loginResponse.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });
      // Step 4: Format and RETURN data (not res.send!) callService will handle the actual HTTP response
      const vendorResponse = new VendorResponseDTO(loginResponse.vendor);

      return {
        vendor: vendorResponse,
        accessToken: loginResponse.accessToken,
        message: "Login successful",
      };
    } catch (error: any) {
      console.error("Error in vendorLogin:", error);
      if (error.name === "ValidationError" || error.statusCode === 400) {
        return {
          status: 500,
          error: {
            message: "Validation failed",
            details: error.message,
            stack: error.stack,
          },
        };
      }
      throw error;
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
      //Step 1: frontend send the token verify the token
      const user: AuthPayload | undefined = payload.req.user;
      if (user) {
        const existingVendor: VendorDoc | null =
          await this.vendorService.vendorProfile(user._id?.toString());
        if (existingVendor) {
          return {
            status: 200,
            vendor: existingVendor,
            message: "Vendor profile fetched successfully",
          };
        }
      } else {
        return {
          status: 401,
          error: {
            message: `User not found ${user}`,
          },
        };
      }
    } catch (error) {
      console.error("Error in vendorProfile:", error);
      throw error;
    }
  };

  updateOwnerProfile = async (payload: ControllerPayload) => {
    try {
      const EditVendorProfile: EditVendorProfileDTO = new EditVendorProfileDTO(
        payload.req.body
      );
      const user: AuthPayload | undefined = payload.req.user;
      if (!user) {
        return {
          status: 401,
          error: {
            message: "User not authenticated",
          },
        };
      }

      const updatedVendor = await this.vendorService.updateOwnerProfile(
        EditVendorProfile,
        user._id?.toString()
      );

      if (!updatedVendor) {
        return {
          status: 404,
          error: {
            message: "Vendor not found",
          },
        };
      }

      return {
        status: 200,
        vendor: new VendorResponseDTO(updatedVendor),
        message: "Vendor profile updated successfully",
      };
    } catch (error: any) {
      console.error("Error in updateProfile:", error);
      return {
        status: 500,
        error: {
          message: "Internal server error",
          details: error.message,
        },
      };
    }
  };

  updateShopImage = async (payload: ControllerPayload) => {
    try {
      const user: AuthPayload | undefined = payload.req.user;
      if (!user) {
        return {
          status: 401,
          error: {
            message: "User not authenticated",
          },
        };
      }

      const file: Express.Multer.File | undefined = payload.req.file;
      if (!file) {
        return {
          status: 400,
          error: {
            message: "No file uploaded",
          },
        };
      }
      const updatedVendor = await this.vendorService.updateShopImage(
        user._id?.toString(),
        file
      );

      if (!updatedVendor) {
        return {
          status: 404,
          error: {
            message: "Vendor not found",
          },
        };
      }

      return {
        status: 200,
        vendor: new VendorResponseDTO(updatedVendor),
        message: "Vendor profile updated successfully",
      };
    } catch (error: any) {
      console.error("Error in updateShopImage:", error);
      return {
        status: 500,
        error: {
          message: "Internal server error",
          details: error.message,
        },
      };
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
