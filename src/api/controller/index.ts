import AdminController from "./AdminController/AdminController";
import { adminService, vendorService, customerService } from "../services";
import VendorController from "./VendorController/VendorController";
import CustomerController from "./CustomerController/CustomerController";

const adminController = new AdminController(adminService);
const vendorController = new VendorController(vendorService);
const customerController = new CustomerController(customerService);

export { adminController, vendorController, customerController };
