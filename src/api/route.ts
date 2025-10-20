import { HttpMethod } from "../constants";
import { adminController, vendorController } from "./controller";
import { auth } from "./middleware/auth.middleware";
import { upload } from "./middleware/multer.middleware";
import { RequestHandler } from "express";
type ControllerFn = (payload: any) => Promise<any>;
// A route can be a single controller or an array where middlewares precede the controller
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
    //get-all-food
  },
  [HttpMethod.POST]: {
    "create-vendor": [auth(["admin"]), adminController.createVendor], // 🛡 admin-only
    "vendor-login": vendorController.vendorLogin,
    //add-food
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
    // "update-vendor-service"
  },
  [HttpMethod.PUT]: {},
  [HttpMethod.DELETE]: {},
};

export default routes;
