import { ControllerPayload } from "../../../constants";
import { VendorDoc } from "../../entities";

export default interface IVendorController {
  vendorLogin: (payload: ControllerPayload) => {};
  vendorProfile: (payload: any) => any;
  updateVendorProfile: (payload: any) => any;
  updateShopImage: (payload: any) => any;
  vendorAddFoods: (payload: ControllerPayload) => any;
  fetchAllFood: (payload: ControllerPayload) => any;
  getCurrentOrder: (payload: any) => any;
  getOrderDetails: (payload: any) => any;
  processOrder: (payload: any) => any;
}

export interface LoginResponse {
  vendor: VendorDoc;
  accessToken: string;
}
