export default interface IVendorController {
  createVendor: (payload: ICreateVendorControllerParams) => any;
  getVendor: (payload: IGetVendorControllerParams) => any;
  getAllVendors: () => any;
  updateVendor: (payload: IUpdateVendorControllerParams) => any;
  deleteVendor: (payload: IDeleteVendorControllerParams) => any;
  toggleVendorService: (payload: IToggleVendorControllerParams) => any;
}

export interface ICreateVendorControllerParams {
  name: string;
  address: string;
  pincode: string;
  foodType: string;
  email: string;
  password: string;
  ownerName: string;
  phone: string;
}

export interface IGetVendorControllerParams {
  id?: string;
  email?: string;
}

export interface IUpdateVendorControllerParams {
  id: string;
  updateData: Record<string, any>;
}

export interface IDeleteVendorControllerParams {
  id: string;
}

export interface IToggleVendorControllerParams {
  id: string;
  serviceAvailable: boolean;
}
