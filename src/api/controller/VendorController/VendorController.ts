import { ControllerPayload } from "../../../constants";
import {
  LoginVendorDTO,
  VendorResponseDTO,
} from "../../dto/interface/Vendor.dto";
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

      // Step 3: Handle HTTP response concerns ONLY
      // Set refresh token as secure HTTP-only cookie
      payload.res.cookie("refreshToken", loginResponse.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });
      // Step 4: Format and RETURN data (not res.send!)
      // Your callService will handle the actual HTTP response
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

  //not implemented right now
  vendorProfile = (payload: any) => {
    throw new Error("Method not implemented");
  };

  updateProfile = (payload: any) => {
    throw new Error("Method not implemented");
  };

  updateShopImage = (payload: any) => {
    throw new Error("Method not implemented");
  };

  vendorAddFoods = (payload: any) => {
    throw new Error("Method not implemented");
  };

  fetchAllFood = (payload: any) => {
    throw new Error("Method not implemented");
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
