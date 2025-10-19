import { HttpMethod } from "../constants";
import { adminController, vendorController } from "./controller";

interface RouteHandlers {
  [key: string]: (payload: any) => Promise<any>;
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
    "create-vendor": adminController.createVendor,
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
