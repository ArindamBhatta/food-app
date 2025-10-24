import AdminService from "./AdminService/AdminService";
import { adminRepo } from "../repos";
import VendorService from "./VendorService/VendorService";
import { vendorRepo, foodRepo } from "../repos";
import FoodService from "./FoodService/FoodService";

const adminService = new AdminService(adminRepo);
const vendorService = new VendorService(vendorRepo);
const foodService = new FoodService(vendorRepo, foodRepo);

export { adminService, vendorService, foodService };
