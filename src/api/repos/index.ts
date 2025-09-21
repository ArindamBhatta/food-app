import { db } from "../../infrastructure/database";
import { Vendor } from "../entities";

// Initialize repositories
import AdminRepo from "./AdminRepo/AdminRepo";

// Create repository instances
const adminRepo = new AdminRepo(Vendor);

// Export repositories and db connection
export { adminRepo };
