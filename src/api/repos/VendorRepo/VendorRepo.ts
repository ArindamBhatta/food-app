import { EditVendorProfileDTO } from "../../dto/interface/Vendor.dto";
import { Vendor, VendorDoc } from "../../entities";
import IVendorRepo from "./VendorRepo.interface";

export default class VendorRepo implements IVendorRepo {
  private db: typeof Vendor;

  constructor(db: typeof Vendor) {
    this.db = db;
  }

  findVendor = async ({
    vendorId,
    email,
  }: {
    vendorId?: string;
    email?: string;
  }): Promise<VendorDoc | null> => {
    try {
      if (email) {
        const vendor: VendorDoc | null = await this.db.findOne({
          email: email.toLowerCase().trim(),
        });

        if (!vendor) {
          throw new Error("Vendor not found");
        }

        return vendor;
      } else if (vendorId) {
        const vendor: VendorDoc | null = await this.db.findById(vendorId);

        if (!vendor) {
          throw new Error("Vendor not found");
        }

        return vendor;
      } else {
        throw new Error("Vendor not found");
      }
    } catch (error) {
      console.error("Error in VendorRepo.findVendor:", error);
      throw new Error("Database error occurred");
    }
  };

  updateRefreshToken = async (
    vendorId: string,
    refreshToken: string
  ): Promise<void> => {
    try {
      const result = await this.db.findByIdAndUpdate(
        vendorId,
        {
          refreshToken: refreshToken,
          refreshTokenUpdatedAt: new Date(),
        },
        { new: true }
      );

      if (!result) {
        throw new Error("Vendor not found for refresh token update");
      }
    } catch (error) {
      console.error("Error in VendorRepo.updateRefreshToken:", error);
      throw new Error("Database error occurred");
    }
  };

  updateOwnerProfile = async (
    vendorId: string,
    UpdateVendorProfile: EditVendorProfileDTO
  ): Promise<VendorDoc | null> => {
    try {
      const updateProfile = await this.db.findByIdAndUpdate(
        vendorId,
        { $set: { ...UpdateVendorProfile } },
        { new: true, runValidators: true }
      );

      if (!updateProfile) {
        throw new Error("Vendor not found for profile update");
      }
      return updateProfile;
    } catch (error) {
      console.error("Error in VendorRepo.updateProfile:", error);
      throw new Error("Database error occurred");
    }
  };

  updateShopImage = async (
    vendorId: string,
    imageUrl: string
  ): Promise<VendorDoc | null> => {
    try {
      const updatedVendor: VendorDoc | null = await this.db.findByIdAndUpdate(
        vendorId,
        { $push: { coverImages: imageUrl } },
        { new: true, runValidators: true }
      );

      if (!updatedVendor) {
        throw new Error("Vendor not found for profile update");
      }
      return updatedVendor;
    } catch (error) {
      console.error("Error in VendorRepo.updateProfile:", error);
      throw new Error("Database error occurred");
    }
  };
}
