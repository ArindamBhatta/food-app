import { Vendor, VendorDoc } from "../../entities";
import { CreateVendorInput } from "../../dto";

export default interface IVendorRepo {
  findVendor: (payload: IFindVendorParams) => Promise<VendorDoc | null>;
  createVendor: (payload: ICreateVendorParams) => Promise<VendorDoc>;
  findAllVendors: () => Promise<VendorDoc[]>;
  findVendorById: (payload: IFindVendorByIdParams) => Promise<VendorDoc | null>;
  updateVendor: (payload: IUpdateVendorParams) => Promise<VendorDoc | null>;
  deleteVendor: (payload: IDeleteVendorParams) => Promise<VendorDoc | null>;
  existsByEmail: (payload: IExistsByEmailParams) => Promise<boolean>;
}

export interface IFindVendorParams {
  id?: string;
  email?: string;
}

export interface ICreateVendorParams extends CreateVendorInput {
  password: string;
  salt: string;
}

export interface IFindVendorByIdParams {
  id: string;
}

export interface IUpdateVendorParams {
  id: string;
  updateData: Partial<VendorDoc>;
}

export interface IDeleteVendorParams {
  id: string;
}

export interface IExistsByEmailParams {
  email: string;
}
