import VendorRepo from "../../repositories/Vendor/VendorRepositories";

import IVendorService, {
  ICreateVendorServiceParams,
  IGetVendorServiceParams,
  IUpdateVendorServiceParams,
  IDeleteVendorServiceParams,
  IToggleVendorServiceParams,
} from "./VendorService.interface";

import { Vendor } from "../../entities";

export default class VendorService implements IVendorService {
  private vendorRepo: VendorRepo;

  constructor(vendorRepo: VendorRepo) {
    this.vendorRepo = vendorRepo;
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

    return this.vendorRepo.createVendor(vendor);
  };

  getVendor = async (payload: IGetVendorServiceParams) => {
    return this.vendorRepo.findVendor(payload);
  };

  getAllVendors = async () => {
    return this.vendorRepo.findAllVendors();
  };

  updateVendor = async (payload: IUpdateVendorServiceParams) => {
    return this.vendorRepo.updateVendor(payload);
  };

  deleteVendor = async (payload: IDeleteVendorServiceParams) => {
    return this.vendorRepo.deleteVendor(payload);
  };

  toggleVendorService = async (payload: IToggleVendorServiceParams) => {
    return this.vendorRepo.toggleService(payload);
  };
}
