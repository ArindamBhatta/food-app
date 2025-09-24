import { VendorDoc } from "../../entities";
import { CreateVendorDTO } from "../../dto/Vendor.dto";

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
