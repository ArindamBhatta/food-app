import { Vendor } from "../entities";

// Initialize repositories
import AdminRepo from "./AdminRepo/AdminRepo";
import VendorRepo from "./VendorRepo/VendorRepo";

// Create repository instances
const adminRepo = new AdminRepo(Vendor);
const vendorRepo = new VendorRepo(Vendor);

// Export repositories and db connection
export { adminRepo, vendorRepo };
