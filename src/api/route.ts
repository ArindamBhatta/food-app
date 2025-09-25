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
  },
  [HttpMethod.POST]: {
    "create-vendor": adminController.createVendor,
    "vendor-login": vendorController.vendorLogin,
  },
  [HttpMethod.PATCH]: {},
  [HttpMethod.PUT]: {},
  [HttpMethod.DELETE]: {},
};

export default routes;
