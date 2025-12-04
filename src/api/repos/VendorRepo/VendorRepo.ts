//Bridge Between Domain & Mongoose

import { EditVendorProfileDTO } from "../../dto/interface/Vendor.dto";
import { VendorModel, VendorDocument } from "../../models";
import { VendorEntity } from "../../../entity/VendorEntity";
import IVendorRepo from "./VendorRepo.interface";

export default class VendorRepo implements IVendorRepo {
  //vendor want a Mongoose mode
  private db: typeof VendorModel;

  constructor(db: typeof VendorModel) {
    this.db = db;
  }

  findVendor = async ({
    vendorId,
    email,
  }: {
    vendorId?: string;
    email?: string;
  }): Promise<VendorEntity | null> => {
    try {
      let vendor: VendorDocument | null = null;
      if (email) {
        vendor = await this.db.findOne({
          email: email.toLowerCase().trim(),
        });
        if (!vendor) {
          throw new Error("Vendor not found");
        }
        return this.toDomain(vendor);
      } else if (vendorId) {
        const vendor: VendorDocument | null = await this.db.findById(vendorId);

        if (!vendor) {
          throw new Error("Vendor not found");
        }
        return this.toDomain(vendor);
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
  ): Promise<VendorEntity | null> => {
    try {
      const updateProfile = await this.db.findByIdAndUpdate(
        vendorId,
        { $set: { ...UpdateVendorProfile } },
        { new: true, runValidators: true }
      );

      if (!updateProfile) {
        throw new Error("Vendor not found for profile update");
      }
      return this.toDomain(updateProfile);
    } catch (error) {
      console.error("Error in VendorRepo.updateProfile:", error);
      throw new Error("Database error occurred");
    }
  };

  updateShopImage = async (
    vendorId: string,
    imageUrl: string
  ): Promise<VendorEntity | null> => {
    try {
      const updatedVendor: VendorDocument | null =
        await this.db.findByIdAndUpdate(
          vendorId,
          { $push: { coverImages: imageUrl } },
          { new: true, runValidators: true }
        );

      if (!updatedVendor) {
        throw new Error("Vendor not found for profile update");
      }
      return this.toDomain(updatedVendor);
    } catch (error) {
      console.error("Error in VendorRepo.updateProfile:", error);
      throw new Error("Database error occurred");
    }
  };

  // --------------------------------------------
  // 🔄 MAPPING BETWEEN MONGOOSE DOC & DOMAIN
  // --------------------------------------------

  private toDomain(doc: VendorDocument): VendorEntity {
    return {
      id: doc._id.toString(),
      name: doc.name,
      ownerName: doc.ownerName,
      foodType: doc.foodType,
      pincode: doc.pincode,
      address: doc.address,
      phone: doc.phone,
      email: doc.email,
      password: doc.password,
      salt: doc.salt,
      serviceAvailable: doc.serviceAvailable,
      coverImages: doc.coverImages,
      rating: doc.rating,
      foods: doc.foods.map((id) => id.toString()),
      refreshToken: doc.refreshToken,
      refreshTokenUpdatedAt: doc.refreshTokenUpdatedAt,
    };
  }
}
