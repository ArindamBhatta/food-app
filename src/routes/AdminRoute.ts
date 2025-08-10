import express, { Request, Response, NextFunction } from "express";
import {
  CreateVendor,
  getAllVendors,
  getVendorById,
} from "../../controller/AdminController";

const router = express.Router();

// Admin creates a new vendor
router.post("/vendor", (req: Request, res: Response, next: NextFunction) => {
  CreateVendor(req, res).catch(next);
});

// Admin gets a list of all vendors
router.get("/vendors", (req: Request, res: Response, next: NextFunction) => {
  getAllVendors(res).catch(next);
});

// Admin gets details of a specific vendor
router.get(
  "/vendors/:id",
  (req: Request, res: Response, next: NextFunction) => {
    getVendorById(req, res).catch(next);
  }
);

//default route
router.get("/", (req: Request, res: Response, next: NextFunction) => {
  res.json({ message: "Hello from Admin" });
});

//Export router as AdminRoute
export { router as AdminRoute };
