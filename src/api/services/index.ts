import AdminService from "./AdminService/AdminService";
import { adminRepo } from "../repos";
import VendorService from "./VendorService/VendorService";
import { vendorRepo } from "../repos";

const adminService = new AdminService(adminRepo);
const vendorService = new VendorService(vendorRepo);

export { adminService, vendorService };
