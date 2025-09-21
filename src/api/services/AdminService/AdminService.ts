import AdminRepo from "../../repos/AdminRepo/AdminRepo";
import { VendorDoc } from "../../entities";
import IAdminService from "./AdminService.interface";
import { CreateVendorDTO } from "../../dto/Vendor.dto";
import { generateSalt, hashPassword } from "../../utils/hash";

export default class AdminService implements IAdminService {
  private adminRepo: AdminRepo;

  constructor(adminRepo: AdminRepo) {
    this.adminRepo = adminRepo;
  }

  createVendor = async (dto: CreateVendorDTO): Promise<VendorDoc> => {
    try {
      // Generate salt and hash password
      const salt = await generateSalt();
      const hashedPassword = await hashPassword(dto.password, salt);

      // Create vendor data for repository
      const vendorData = {
        name: dto.name,
        address: dto.address,
        pincode: dto.pincode,
        foodType: dto.foodType,
        email: dto.email,
        password: hashedPassword,
        ownerName: dto.ownerName,
        phone: dto.phone,
        salt,
      };

      const vendor = await this.adminRepo.createVendor(vendorData);

      if (!vendor) {
        throw new Error("Failed to create vendor");
      }

      return vendor;
    } catch (error) {
      console.error("Error in AdminService.createVendor:", error);
      throw error; // Re-throw to be handled by the controller
    }
  };
}
