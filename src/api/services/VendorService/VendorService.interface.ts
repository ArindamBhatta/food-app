import { LoginVendorDTO } from "../../dto/interface/Vendor.dto";
import { VendorDoc } from "../../entities";

export default interface IVendorService {
  vendorLogin(loginVendor: LoginVendorDTO): Promise<LoginResponse>;
}

export interface LoginResponse {
  vendor: VendorDoc;
  accessToken: string;
  refreshToken: string;
}
