import bcrypt from "bcrypt";
import { VendorDoc } from "../../entities";
import IVendorService, { LoginResponse } from "./VendorService.interface";
import VendorRepo from "../../repos/VendorRepo/VendorRepo";
import {
  generateRefreshToken,
  generateAccessToken,
} from "../../utils/auth.utility";
import { LoginVendorDTO, VendorPayload } from "../../dto/interface/Vendor.dto";

export default class VendorService implements IVendorService {
  private vendorRepo: VendorRepo;

  constructor(vendorRepo: VendorRepo) {
    this.vendorRepo = vendorRepo;
  }

  private async validatePassword(
    plainPassword: string,
    hashedPassword: string,
    salt: string
  ): Promise<boolean> {
    try {
      // Recreate the hash using the provided salt
      const hashInput = await bcrypt.hash(plainPassword, salt);
      return hashInput === hashedPassword;
    } catch (error) {
      console.error("Error validating password:", error);
      return false;
    }
  }

  vendorLogin = async (loginVendor: LoginVendorDTO): Promise<LoginResponse> => {
    try {
      // Step 1: Find vendor via email
      const vendor: VendorDoc | null = await this.vendorRepo.loginVendor(
        loginVendor.email
      );

      if (!vendor) {
        throw new Error("Invalid credentials");
      }

      // Step 2: Verify password
      const isPasswordValid = await this.validatePassword(
        loginVendor.password,
        vendor.password,
        vendor.salt
      );

      if (!isPasswordValid) {
        throw new Error("Invalid credentials");
      }

      // Step 3: Create vendor-specific payload that conforms to AuthPayload
      const authPayload: VendorPayload = {
        _id: vendor._id?.toString() || vendor.id?.toString(), // FIXED: Handle unknown _id type
        email: vendor.email,
        name: vendor.name,
        ownerName: vendor.ownerName,
        foodType: vendor.foodType,
        role: "vendor",
        serviceAvailable: vendor.serviceAvailable,
      };

      // Step 4: Generate access token using existing utility
      const accessToken = generateAccessToken(authPayload);

      // Step 5: Generate refresh token using existing utility
      const refreshToken = generateRefreshToken(authPayload);

      // Step 6: Save refresh token in database
      const vendorId = vendor._id?.toString() || vendor.id?.toString();
      if (!vendorId) {
        throw new Error("Vendor ID not found");
      }
      await this.vendorRepo.updateRefreshToken(vendorId, refreshToken);

      // Step 7: Return tokens and vendor info
      return {
        vendor,
        accessToken,
        refreshToken,
      };
    } catch (error) {
      console.error("Error in vendorLogin:", error);
      throw error;
    }
  };

  vendorProfile = async (vendorId: string): Promise<VendorDoc | null> => {
    try {
      // Step 1: Find vendor via ID
      const vendor: VendorDoc | null = await this.vendorRepo.vendorProfile(
        vendorId
      );

      if (!vendor) {
        throw new Error("Vendor not found");
      }

      return vendor;
    } catch (error) {
      console.error("Error in vendorProfile:", error);
      throw error;
    }
  };
}
