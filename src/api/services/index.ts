import AdminService from "./AdminService/AdminService";
import { adminRepo } from "../repos";

const adminService = new AdminService(adminRepo);

export { adminService };
