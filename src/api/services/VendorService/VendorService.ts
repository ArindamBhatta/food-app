import bcrypt from "bcrypt";
import { VendorDoc } from "../../entities";
import IVendorService, { LoginResponse } from "./VendorService.interface";
import VendorRepo from "../../repos/VendorRepo/VendorRepo";
import {
  generateRefreshToken,
  generateAccessToken,
} from "../../utils/auth.utility";
import {
  EditVendorProfileDTO,
  LoginVendorDTO,
  VendorPayload,
} from "../../dto/interface/Vendor.dto";
import { uploadBuffer } from "../../utils/UploadPicture.utility";

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
      const vendor: VendorDoc | null = await this.vendorRepo.findVendor({
        email: loginVendor.email,
      });

      if (!vendor) {
        throw new Error("Invalid credentials");
      }

      // Step 2: Verify password using bcrypt
      const isPasswordValid: boolean = await this.validatePassword(
        loginVendor.password,
        vendor.password,
        vendor.salt
      );

      if (!isPasswordValid) {
        throw new Error("Invalid credentials");
      }

      // Step 3: Create vendor-specific payload
      const authPayload: VendorPayload = {
        _id: vendor._id?.toString() || vendor.id?.toString(),
        role: "vendor",
        email: vendor.email,
      };

      // Step 4: Generate access token
      const accessToken = generateAccessToken(authPayload);

      // Step 5: Generate refresh token
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
      const vendor: VendorDoc | null = await this.vendorRepo.findVendor({
        vendorId,
      });

      if (!vendor) {
        throw new Error("Vendor not found");
      }

      return vendor;
    } catch (error) {
      console.error("Error in vendorProfile:", error);
      throw error;
    }
  };

  updateOwnerProfile = async (
    UpdateVendorProfile: EditVendorProfileDTO,
    vendorId: string
  ): Promise<VendorDoc | null> => {
    try {
      const updatedVendor: VendorDoc | null =
        await this.vendorRepo.updateOwnerProfile(vendorId, UpdateVendorProfile);
      if (!updatedVendor) {
        throw new Error("failed to update vendor profile");
      }
      return updatedVendor;
    } catch (error) {
      console.error("Error in updateProfile:", error);
      throw error;
    }
  };

  updateShopImage = async (
    vendorId: string,
    file: Express.Multer.File
  ): Promise<VendorDoc | null> => {
    try {
      //1)upload file in cloudinary
      const { secure_url } = await uploadBuffer(file);

      //2)persist url in db via vendorRepo
      const updatedVendor: VendorDoc | null =
        await this.vendorRepo.updateShopImage(vendorId, secure_url);

      //3) return updated vendor
      if (!updatedVendor) {
        throw new Error("failed to update vendor profile");
      }
      return updatedVendor;
    } catch (error) {
      console.error("Error in updateProfile:", error);
      throw error;
    }
  };
}
