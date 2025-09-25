import { VendorDoc } from "../../entities";

export default interface IVendorRepo {
  loginVendor: (email: string) => Promise<VendorDoc | null>;
  updateRefreshToken: (vendorId: string, refreshToken: string) => Promise<void>;
}
