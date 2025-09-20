export default interface IAdminController {
  createVendor: (payload: ICreateVendorControllerParams) => any;
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
