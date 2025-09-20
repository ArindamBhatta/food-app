import AdminService from "../../services/AdminService/AdminService";

import IAdminController, {
  ICreateVendorControllerParams,
} from "./AdminController.interface";

export default class AdminController implements IAdminController {
  private adminService: AdminService;

  constructor(adminService: AdminService) {
    this.adminService = adminService;
  }
  createVendor = (payload: ICreateVendorControllerParams) => {
    return this.adminService.createVendor(payload);
  };
}
