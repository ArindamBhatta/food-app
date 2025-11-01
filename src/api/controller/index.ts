import AdminController from "./AdminController/AdminController";
import { adminService, vendorService, customerService, foodService } from "../services";
import VendorController from "./VendorController/VendorController";
import CustomerController from "./CustomerController/CustomerController";

const adminController = new AdminController(adminService);
const vendorController = new VendorController(vendorService, foodService);
const customerController = new CustomerController(customerService);

export { adminController, vendorController, customerController };
