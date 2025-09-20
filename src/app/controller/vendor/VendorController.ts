// src/api/controllers/VendorController/VendorController.ts
import IVendorController, {
  ICreateVendorControllerParams,
  IGetVendorControllerParams,
  IUpdateVendorControllerParams,
  IDeleteVendorControllerParams,
  IToggleVendorControllerParams,
} from "./VendorController.interface";
import VendorService from "../../services/vendor/VendorService";

export default class VendorController implements IVendorController {
  private vendorService: VendorService;

  constructor(vendorService: VendorService) {
    this.vendorService = vendorService;
  }

  createVendor = async (payload: ICreateVendorControllerParams) => {
    try {
      return await this.vendorService.createVendor(payload);
    } catch (err) {
      console.error("Error in VendorController::createVendor", err);
      throw err;
    }
  };

  getVendor = async (payload: IGetVendorControllerParams) => {
    try {
      return await this.vendorService.getVendor(payload);
    } catch (err) {
      console.error("Error in VendorController::getVendor", err);
      throw err;
    }
  };

  getAllVendors = async () => {
    try {
      return await this.vendorService.getAllVendors();
    } catch (err) {
      console.error("Error in VendorController::getAllVendors", err);
      throw err;
    }
  };

  updateVendor = async (payload: IUpdateVendorControllerParams) => {
    try {
      return await this.vendorService.updateVendor(payload);
    } catch (err) {
      console.error("Error in VendorController::updateVendor", err);
      throw err;
    }
  };

  deleteVendor = async (payload: IDeleteVendorControllerParams) => {
    try {
      return await this.vendorService.deleteVendor(payload);
    } catch (err) {
      console.error("Error in VendorController::deleteVendor", err);
      throw err;
    }
  };

  toggleVendorService = async (payload: IToggleVendorControllerParams) => {
    try {
      return await this.vendorService.toggleVendorService(payload);
    } catch (err) {
      console.error("Error in VendorController::toggleVendorService", err);
      throw err;
    }
  };
}
