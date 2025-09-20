import { Vendor, VendorDoc } from "../../entities";

import IVendorRepo, {
  IFindVendorByIdParams,
  ICreateVendorParams,
  IUpdateVendorParams,
  IDeleteVendorParams,
  IExistsByEmailParams,
  IFindVendorParams,
  IToggleVendorRepoParams,
} from "./VendorRepository.interface";

export default class VendorRepo implements IVendorRepo {
  private model: typeof Vendor;

  constructor(model: typeof Vendor) {
    this.model = model;
  }

  findVendor = async (
    payload: IFindVendorParams
  ): Promise<VendorDoc | null> => {
    if (payload.email) {
      return await this.model.findOne({ email: payload.email });
    } else if (payload.id) {
      return await this.model.findById(payload.id);
    }
    return null;
  };

  createVendor = async (payload: ICreateVendorParams): Promise<VendorDoc> => {
    return await this.model.create({
      name: payload.name,
      address: payload.address,
      pincode: payload.pincode,
      foodType: payload.foodType,
      email: payload.email,
      password: payload.password,
      salt: payload.salt,
      ownerName: payload.ownerName,
      phone: payload.phone,
      rating: 0,
      serviceAvailable: false,
      coverImages: [],
      foods: [],
    });
  };

  findAllVendors = async (): Promise<VendorDoc[]> => {
    return await this.model.find();
  };

  findVendorById = async (
    payload: IFindVendorByIdParams
  ): Promise<VendorDoc | null> => {
    return await this.model.findById(payload.id);
  };

  updateVendor = async (
    payload: IUpdateVendorParams
  ): Promise<VendorDoc | null> => {
    return await this.model.findByIdAndUpdate(payload.id, payload.updateData, {
      new: true,
    });
  };
  deleteVendor = async (
    payload: IDeleteVendorParams
  ): Promise<VendorDoc | null> => {
    return await this.model.findByIdAndDelete(payload.id);
  };

  existsByEmail = async (payload: IExistsByEmailParams): Promise<boolean> => {
    const vendor = await this.model.findOne({ email: payload.email });
    return vendor !== null;
  };

  toggleService = async (payload: IToggleVendorRepoParams) => {
    return await this.model.findByIdAndUpdate(
      payload.id,
      { serviceAvailable: payload.serviceAvailable },
      { new: true }
    );
  };
}
