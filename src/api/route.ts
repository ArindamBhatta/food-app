import { HttpMethod } from "../constants";
import { adminController } from "./controller";

interface RouteHandlers {
  [key: string]: (payload: any) => Promise<any>;
}

type RouteMap = {
  [key in HttpMethod]?: RouteHandlers;
};

const routes: RouteMap = {
  [HttpMethod.GET]: {
    "vendor-by-id": adminController.getVendorById,
  },
  [HttpMethod.POST]: {
    "create-vendor": adminController.createVendor,
  },
  [HttpMethod.PATCH]: {},
  [HttpMethod.PUT]: {},
  [HttpMethod.DELETE]: {},
};

export default routes;
