import { ControllerPayload } from "../../../constants";
import { VendorResponseDTO } from "../../dto/interface/Vendor.dto";

export default interface IAdminController {
  createVendor: (payload: ControllerPayload) => Promise<VendorResponseDTO>;
  getAllVendor: (payload: ControllerPayload) => Promise<VendorResponseDTO[]>;
  getVendorById: (payload: ControllerPayload) => Promise<VendorResponseDTO>;
}
