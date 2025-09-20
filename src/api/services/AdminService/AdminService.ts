import AdminRepo from "../../repos/AdminRepo/AdminRepo";
import { Vendor } from "../../entities";
import IAdminController, {
  ICreateVendorServiceParams,
} from "./AdminService.interface";

export default class AdminService implements IAdminController {
  private adminRepo: AdminRepo;

  constructor(adminRepo: AdminRepo) {
    this.adminRepo = adminRepo;
  }

  createVendor = async (payload: ICreateVendorServiceParams) => {
    const vendor = new Vendor({
      name: payload.name,
      address: payload.address,
      pincode: payload.pincode,
      foodType: payload.foodType,
      email: payload.email,
      password: payload.password,
      ownerName: payload.ownerName,
      phone: payload.phone,
    });

    return this.adminRepo.createVendor(vendor);
  };
}
