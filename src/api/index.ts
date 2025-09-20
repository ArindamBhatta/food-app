import express, { Request, Response, IRouter } from "express";
import { HttpMethod, ApiVersion } from "../constants";
import { auth } from "./middleware/auth";
import routes from "./route";

const router = express.Router();

export default (): IRouter => {
  const mwCtxForPost = {};
  const mwCtxForGet = {};

  const postMWs = [auth].map((fn) => fn(mwCtxForPost));
  const getMWs = [auth].map((fn) => fn(mwCtxForGet));

  const callService = async (
    method: HttpMethod,
    req: Request,
    res: Response
  ) => {
    const apiVersion = req.params.apiversion || ApiVersion.V1;
    const serviceName = req.params.service;
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
      const response = await serviceDef({ req, res });
      res.send(response);
    } catch (error) {
      console.error("Error calling service:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  };

  router.get(
    "/:apiversion/:service",
    ...getMWs,
    async (req: Request, res: Response) => {
      await callService(HttpMethod.GET, req, res);
    }
  );
  router.post(
    "/:apiversion/:service",
    ...postMWs,
    async (req: Request, res: Response) => {
      await callService(HttpMethod.POST, req, res);
    }
  );

  return router;
};
