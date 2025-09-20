import AdminController from "./AdminController/AdminController";
import { adminService } from "../services";

const adminController = new AdminController(adminService);

export { adminController };
