import { Vendor, Food } from "../entities";

// Initialize repositories
import AdminRepo from "./AdminRepo/AdminRepo";
import VendorRepo from "./VendorRepo/VendorRepo";
import FoodRepo from "./FoodRepo/FoodRepo";

// Create repository instances
const adminRepo = new AdminRepo(Vendor);
const vendorRepo = new VendorRepo(Vendor);
const foodRepo = new FoodRepo(Food, Vendor);

// Export repositories and db connection
export { adminRepo, vendorRepo, foodRepo };
