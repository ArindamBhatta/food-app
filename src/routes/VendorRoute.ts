import express, { Request, Response, NextFunction } from "express";

import {
  GetVendorProfile,
  UpdateVendorService,
  UpdateVendorProfile,
  VendorLogin,
  AddFood,
  getFood,
  UpdateVendorCoverImage,
} from "../../controller/VendorController";

import { Authenticate } from "../middlewares/Controller";

import multer from "multer";

const router = express.Router();

const imageStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "images");
  },
  filename: function (req, file, cb) {
    // Windows simply does not allow certain characters in file or folder names < > : " / \ | ? *
    const safeName =
      new Date().toISOString().replace(/:/g, "-") + file.originalname; //replace colons
    cb(null, safeName);
  },
});

const images = multer({ storage: imageStorage }).array("images", 10);

//vendor login check get the token from json web token
router.post("/login", (req: Request, res: Response, next: NextFunction) => {
  VendorLogin(req, res).catch(next);
});

//run automatically before all routes.
router.use(Authenticate);

//get profile
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

//update profile
router.patch(
  "/profile",
  async (req: Request, res: Response, next: NextFunction) => {
    UpdateVendorProfile(req, res).catch(next);
  }
);

router.patch(
  "/coverimage",
  (req: Request, res: Response, next: NextFunction) => {
    images(req, res, (err) => {
      if (err) {
        return res
          .status(500)
          .json({ error: `Error uploading images ${err.message}` });
      }
      UpdateVendorCoverImage(req, res).catch(next);
    });
  }
);

router.patch("/service", (req: Request, res: Response, next: NextFunction) => {
  UpdateVendorService(req, res);
});

//food route
router.post("/food", (req: Request, res: Response, next: NextFunction) => {
  images(req, res, (err) => {
    if (err) {
      return res
        .status(500)
        .json({ error: `Error uploading images ${err.message}` });
    }
    AddFood(req, res).catch(next);
  });
});

router.get("/foods", (req: Request, res: Response, next: NextFunction) => {
  getFood(req, res).catch(next);
});

export { router as VendorRoute };
