import { CreateVendorDTO } from "../../dto/Vendor.dto";
import { VendorDoc } from "../../entities";

export default interface IAdminService {
  createVendor: (dto: CreateVendorDTO) => Promise<VendorDoc>;
  getVendorByID: (vendorId: string) => Promise<VendorDoc>;
}
