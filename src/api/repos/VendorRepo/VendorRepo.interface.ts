import { VendorDoc } from "../../entities";

export default interface IVendorRepo {
  findVendor: (vendorId?: string, email?: string) => Promise<VendorDoc | null>;
  updateRefreshToken: (vendorId: string, refreshToken: string) => Promise<void>;
}
