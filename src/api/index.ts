import express, { Request, Response, IRouter } from "express";
import { HttpMethod, ApiVersion } from "../constants";
import { auth } from "./middleware/auth";
import routes from "./route";
import { BusinessLogicError } from "./utils/Error";

const router = express.Router();

export default (): IRouter => {
  const postMWs = [auth].map((fn) => []);
  const getMWs = [auth].map((fn) => []);

  // Route for GET requests with ID parameter
  router.get(
    "/:apiversion/:service/:id?",
    ...getMWs,
    async (req: Request, res: Response) => {
      await callService(HttpMethod.GET, req, res);
    }
  );

  // Route for POST requests
  router.post(
    "/:apiversion/:service",
    ...postMWs,
    async (req: Request, res: Response) => {
      await callService(HttpMethod.POST, req, res);
    }
  );

  return router;
};

const callService = async (method: HttpMethod, req: Request, res: Response) => {
  const apiVersion: string = req.params.apiversion || ApiVersion.V1;
  const serviceName: string = req.params.service;
  console.log("callService", { method, serviceName });

  let serviceDef;

  switch (apiVersion) {
    case ApiVersion.V1:
    case ApiVersion.V2:
      serviceDef = routes[method]?.[serviceName];
      break;
    default:
      return res.status(400).json({ message: "Unsupported API version" });
  }

  if (!serviceDef) {
    return res.status(404).json({ message: "Service not found" });
  }

  try {
    const data = await serviceDef({ req }); // controller returns data
    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error("Error calling service:", error);
    if (error instanceof BusinessLogicError) {
      return res.status(400).json({ success: false, message: error.message });
    }
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
