import express, { Request, Response, NextFunction } from "express";

import {
  GetVendorProfile,
  GetVendorService,
  UpdateVendorProfile,
  VendorLogin,
} from "../controller/VendorController";
import { Authenticate } from "../middlewares/Controller";

const router = express.Router();

router.post("/login", (req: Request, res: Response, next: NextFunction) => {
  VendorLogin(req, res).catch(next);
});
//
router.use(Authenticate);
router.get(
  "/profile",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await GetVendorProfile(req, res);
    } catch (err) {
      next(err);
    }
  }
);
router.patch("/profile", UpdateVendorProfile);
router.patch("/service", GetVendorService);

export { router as VenderRoute };
