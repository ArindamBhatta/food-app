import { Response } from "express";
import { ControllerPayload } from "../../../constants";

export interface IAdminController {
  createVendor: (payload: ControllerPayload) => Promise<Response>;
}
