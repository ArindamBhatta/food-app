import { VendorDoc } from "../../entities";

export default interface IAdminRepo {
  createVendor: (payload: ICreateVendorParams) => Promise<VendorDoc | null>;
}

//dto
export interface ICreateVendorParams {
  name: string;
  ownerName: string;
  foodType: [string];
  pincode: string;
  address: string;
  phone: string;
  email: string;
  salt: string;
  password: string;
}
