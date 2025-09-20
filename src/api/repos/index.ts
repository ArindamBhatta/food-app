import { Vendor } from "../entities";

// import VendorRepo from "./Vendor/VendorRepositories";
import AdminRepo from "./AdminRepo/AdminRepo";

// const vendorRepo = new VendorRepo(Vendor);
const adminRepo = new AdminRepo(Vendor);

export { adminRepo };
