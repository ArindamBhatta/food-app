import { Vendor, VendorDoc } from "../../entities";
import IVendorRepo from "./VendorRepo.interface";

export default class VendorRepo implements IVendorRepo {
  private db: typeof Vendor;

  constructor(db: typeof Vendor) {
    this.db = db;
  }

  loginVendor = async (email: string): Promise<VendorDoc | null> => {
    try {
      const vendor: VendorDoc | null = await this.db.findOne({
        email: email.toLowerCase().trim(),
      });

      return vendor;
    } catch (error) {
      console.error("Error in VendorRepo.loginVendor:", error);
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
}
