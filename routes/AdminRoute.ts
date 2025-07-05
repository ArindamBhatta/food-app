import express, { Request, Response, NextFunction } from "express";
import {
  CreateVendor,
  getVendor,
  getVendorById,
} from "../controller/AdminController";

const router = express.Router();

router.post("/vender", CreateVendor);
router.post("/venders", getVendor);
router.post("/venders/:id", getVendorById);

router.get("/", (req: Request, res: Response, next: NextFunction) => {
  res.json({ message: "Hello from Admin" });
});

export { router as AdminRoute };
