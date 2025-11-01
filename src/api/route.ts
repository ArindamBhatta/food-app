import { HttpMethod } from "../constants";
import {
  adminController,
  vendorController,
  customerController,
} from "./controller";
import { auth } from "./middleware/auth.middleware";
import { upload } from "./middleware/multer.middleware";
import { RequestHandler } from "express";
type ControllerFn = (payload: any) => Promise<any>;

export type RouteDefinition = ControllerFn | (RequestHandler | ControllerFn)[];
interface RouteHandlers {
  [key: string]: RouteDefinition;
}

type RouteMap = {
  [key in HttpMethod]?: RouteHandlers;
};

const routes: RouteMap = {
  [HttpMethod.GET]: {
    "vendor-by-id": adminController.getVendorById,
    "all-vendor": adminController.getAllVendor,
    "get-vendor-profile": [auth(["vendor"]), vendorController.vendorProfile],
    "get-all-food": [auth(["vendor"]), vendorController.fetchAllFood],
  },
  [HttpMethod.POST]: {
    "create-vendor": [auth(["admin"]), adminController.createVendor], // 🛡 admin-only
    "vendor-login": vendorController.vendorLogin,
    "create-customer": customerController.signUp,
    "otp-validation": customerController.otpVerify,
    "customer-login": customerController.signIn,
    "add-food": [
      auth(["vendor"]),
      upload.array("images", 5),
      vendorController.vendorAddFoods,
    ],
  },
  [HttpMethod.PATCH]: {
    "update-vendor-profile": [
      auth(["vendor"]),
      vendorController.updateOwnerProfile,
    ],
    "update-vendor-cover-image": [
      auth(["vendor"]),
      upload.single("shopImage"),
      vendorController.updateShopImage,
    ],
    "customer-profile": [
      auth(["customer"]),
      customerController.addDetailsOfUser,
    ],
    // "update-vendor-service"
  },
  [HttpMethod.PUT]: {},
  [HttpMethod.DELETE]: {},
};

export default routes;
