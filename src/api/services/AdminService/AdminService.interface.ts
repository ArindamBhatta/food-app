import { CreateVendorDTO } from "../../dto/interface/Vendor.dto";
import { VendorDoc } from "../../models";

export default interface IAdminService {
  createVendor: (dto: CreateVendorDTO) => Promise<VendorDoc>;
  getVendorByID: (vendorId: string) => Promise<VendorDoc>;
  getAllVendor: () => Promise<VendorDoc[]>;
}
