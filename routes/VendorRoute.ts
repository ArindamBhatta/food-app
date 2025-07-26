import express, { Request, Response, NextFunction } from "express";

import {
  GetVendorProfile,
  UpdateVendorService,
  UpdateVendorProfile,
  VendorLogin,
  AddFood,
} from "../controller/VendorController";

import { Authenticate } from "../middlewares/Controller";

const router = express.Router();

//vendor login check get the token from json web token
router.post("/login", (req: Request, res: Response, next: NextFunction) => {
  VendorLogin(req, res).catch(next);
});

//middleware is check
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
router.patch(
  "/profile",
  async (req: Request, res: Response, next: NextFunction) => {
    UpdateVendorProfile(req, res).catch(next);
  }
);
router.patch("/service", (req: Request, res: Response, next: NextFunction) => {
  UpdateVendorService(req, res);
});

router.post("/food", (req: Request, res: Response, next: NextFunction) => {
  AddFood(req, res).catch(next);
});

router.get("/foods", (req: Request, res: Response, next: NextFunction) => {
  // You may want to implement the handler for getting foods here
  // For now, just send a placeholder response or call the appropriate controller
  res.status(501).json({ message: "Not implemented" });
});

export { router as VendorRoute };
