import { CreateVendorDTO } from "../../dto/interface/Vendor.dto";
import { VendorDoc } from "../../entities";

export default interface IAdminRepo {
  createVendor: (payload: ICreateVendorRepoParams) => Promise<VendorDoc>;
  getVendorByID: (vendorId: string) => Promise<VendorDoc>;
  getAllVendor: () => Promise<VendorDoc[]>;
}

export interface ICreateVendorRepoParams
  extends Omit<CreateVendorDTO, "password"> {
  password: string; // This will be the hashed password
  salt: string;
  serviceAvailable?: boolean;
  rating?: number;
  coverImages?: string[];
  foods?: string[];
}
