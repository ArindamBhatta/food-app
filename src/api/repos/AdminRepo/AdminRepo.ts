import { Vendor, VendorDoc } from "../../entities";
import IAdminRepo, { ICreateVendorParams } from "./AdminRepo.interface";

export default class AdminRepo implements IAdminRepo {
  private db: typeof Vendor;

  constructor(db: typeof Vendor) {
    this.db = db;
  }

  createVendor = async (
    payload: ICreateVendorParams
  ): Promise<VendorDoc | null> => {
    return await this.db.create({
      name: payload.name,
      ownerName: payload.ownerName,
      foodType: payload.foodType,
      pincode: payload.pincode,
      address: payload.address,
      phone: payload.phone,
      email: payload.email,
      password: payload.password,
      salt: payload.salt,
      coverImages: [],
      foods: [],
    });
  };
}
