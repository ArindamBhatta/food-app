import AdminRepo from "../../repos/AdminRepo/AdminRepo";
import { VendorDoc } from "../../entities";
import IAdminService from "./AdminService.interface";
import { CreateVendorDTO } from "../../dto/Vendor.dto";
import { generateSalt, hashPassword } from "../../utils/hash";
import { ICreateVendorRepoParams } from "../../repos/AdminRepo/AdminRepo.interface";
import { BusinessLogicError } from "../../utils/Error";
import logger from "../../../infrastructure/logger/winston";

export default class AdminService implements IAdminService {
  private adminRepo: AdminRepo;

  constructor(adminRepo: AdminRepo) {
    this.adminRepo = adminRepo;
  }
  //
  createVendor = async (vendorDto: CreateVendorDTO): Promise<VendorDoc> => {
    try {
      // Generate a salt
      const salt: string = await generateSalt();

      // start hashing
      const hashedPassword: string = await hashPassword(
        vendorDto.password,
        salt
      );

      // create vendor data for repository who communicate with database
      const vendorData: ICreateVendorRepoParams = {
        name: vendorDto.name,
        address: vendorDto.address,
        pincode: vendorDto.pincode,
        foodType: vendorDto.foodType,
        email: vendorDto.email,
        password: hashedPassword,
        ownerName: vendorDto.ownerName,
        phone: vendorDto.phone,
        salt,
      };
      //now pass the create vendor data to repository
      const vendor: VendorDoc = await this.adminRepo.createVendor(vendorData);

      if (!vendor) {
        throw new Error("Failed to create vendor");
      }

      return vendor;
    } catch (error) {
      console.error("Error in AdminService.createVendor:", error);
      throw error; // Re-throw to be handled by the controller
    }
  };

  getVendorByID = async (vendorId: string): Promise<VendorDoc> => {
    try {
      if (!vendorId?.trim()) {
        throw new BusinessLogicError("Vendor ID is required");
      }

      const vendor: VendorDoc = await this.adminRepo.getVendorByID(vendorId);

      if (!vendor) {
        throw new BusinessLogicError("Vendor not found", 404);
      }

      return vendor;
    } catch (error) {
      logger.error(
        `Error in AdminService.getVendorByID for ID ${vendorId}:`,
        error
      );
      throw error;
    }
  };
}
