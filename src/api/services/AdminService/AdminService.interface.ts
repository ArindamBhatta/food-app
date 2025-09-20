export default interface IAdminController {
  createVendor: (payload: ICreateVendorServiceParams) => any;
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
