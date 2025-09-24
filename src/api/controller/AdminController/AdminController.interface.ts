import { Response } from "express";
import { ControllerPayload } from "../../../constants";

export default interface IAdminController {
  createVendor: (payload: ControllerPayload) => Promise<Response>;
  getVendorById: (payload: ControllerPayload) => Promise<Response>;
}
