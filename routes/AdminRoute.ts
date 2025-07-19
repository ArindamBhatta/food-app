import express, { Request, Response, NextFunction } from "express";
import {
  CreateVendor,
  getVendor,
  getVendorById,
} from "../controller/AdminController";

const router = express.Router();

router.post("/vendor", (req: Request, res: Response, next: NextFunction) => {
  CreateVendor(req, res).catch(next);
}); // Admin creates a new vendor

router.get("/vendors", (req: Request, res: Response, next: NextFunction) => {
  getVendor(req, res, next).catch(next);
}); // Admin gets a list of vendors

router.get(
  "/vendors/:id",
  (req: Request, res: Response, next: NextFunction) => {
    getVendorById(req, res, next).catch(next);
  }
); // Admin gets details of a specific vendor

router.get("/", (req: Request, res: Response, next: NextFunction) => {
  res.json({ message: "Hello from Admin" });
});

export { router as AdminRoute };
