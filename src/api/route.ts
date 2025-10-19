import { HttpMethod } from "../constants";
import { adminController, vendorController } from "./controller";
import { auth } from "./middleware/auth.middleware";
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
    "get-vendor-profile": vendorController.vendorProfile,
    //get-all-food
  },
  [HttpMethod.POST]: {
    "create-vendor": [auth(["admin"]), adminController.createVendor], // 🛡 admin-only
    "vendor-login": vendorController.vendorLogin,
    //add-food
  },
  [HttpMethod.PATCH]: {
    // "update-vendor-profile": vendorController.updateVendorProfile,
    // "update-vendor-cover-image"
    // "update-vendor-service"
  },
  [HttpMethod.PUT]: {},
  [HttpMethod.DELETE]: {},
};

export default routes;
