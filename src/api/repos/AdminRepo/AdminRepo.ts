import { Vendor, VendorDoc } from "../../entities";
import IAdminRepo, { ICreateVendorRepoParams } from "./AdminRepo.interface";

export default class AdminRepo implements IAdminRepo {
  private db: typeof Vendor;

  constructor(db: typeof Vendor) {
    this.db = db;
  }

  createVendor = async (
    payload: ICreateVendorRepoParams
  ): Promise<VendorDoc> => {
    try {
      const vendor = await this.db.create({
        name: payload.name,
        ownerName: payload.ownerName,
        foodType: payload.foodType,
        pincode: payload.pincode,
        address: payload.address,
        phone: payload.phone,
        email: payload.email.toLowerCase(),
        password: payload.password,
        salt: payload.salt,
        coverImages: [],
        foods: [],
        serviceAvailable: false,
        rating: 0,
      });

      if (!vendor) {
        throw new Error('Failed to create vendor in database');
      }

      return vendor;
    } catch (error) {
      console.error('Error in AdminRepo.createVendor:', error);
      throw error;
    }
  };
}
