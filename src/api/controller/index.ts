import AdminController from "./AdminController/AdminController";
import { adminService, vendorService } from "../services";
import VendorController from "./VendorController/VendorController";

const adminController = new AdminController(adminService);
const vendorController = new VendorController(vendorService);

export { adminController, vendorController };
