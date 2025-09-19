export default interface IVendorService {
  createVendor: (payload: ICreateVendorServiceParams) => any;
  getVendor: (payload: IGetVendorServiceParams) => any;
  getAllVendors: () => any;
  updateVendor: (payload: IUpdateVendorServiceParams) => any;
  deleteVendor: (payload: IDeleteVendorServiceParams) => any;
}

export interface ICreateVendorServiceParams {
  name: string;
  address: string;
  pincode: string;
  foodType: string;
  email: string;
  password: string;
  ownerName: string;
  phone: string;
}

export interface IGetVendorServiceParams {
  id?: string;
  email?: string;
}

export interface IUpdateVendorServiceParams {
  id: string;
  updateData: Record<string, any>;
}

export interface IDeleteVendorServiceParams {
  id: string;
}
