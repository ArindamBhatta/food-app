import express, { Request, Response, IRouter } from "express";
import { HttpMethod, ApiVersion, ControllerPayload } from "./constants";
import { auth } from "./middleware";
import route from "./routes";

const router = express.Router();

export default (): IRouter => {
  const mwCtxForPost = {};
  const mwCtxForGet = {};
  const mwCtxForPatch = {};
  const mwCtxForPut = {};
  const mwCtxForDelete = {};

  const postMWs = [auth].map((fn) => fn(mwCtxForPost));
  const getMWs = [auth].map((fn) => fn(mwCtxForGet));
  const patchMWs = [auth].map((fn) => fn(mwCtxForPatch));
  const putMWs = [auth].map((fn) => fn(mwCtxForPut));
  const deleteMWs = [auth].map((fn) => fn(mwCtxForDelete));

  const callService = async (
    method: HttpMethod,
    req: Request,
    res: Response
  ) => {
    const apiVersion = req.params.apiversion || ApiVersion.V1; // Default version is v1
    const serviceName = req.params.service;
    console.log("callService", { method, serviceName, apiVersion });

    let serviceDef;

    switch (apiVersion) {
      case ApiVersion.V1:
        serviceDef = route[method]?.[serviceName];
        break;
      case ApiVersion.V2:
        serviceDef = route[method]?.[serviceName];
        break;
      default:
        serviceDef = undefined;
    }

    if (!serviceDef) {
      return res.status(404).json({ error: "Service not found" });
    }

    try {
      const resp = await serviceDef({ req, res });
      res.json(resp);
    } catch (err: any) {
      console.error("Service error:", err);
      res.status(500).json({
        error: err.message || "Internal server error",
        ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
      });
    }
  };

  // GET /api/v1/service-name
  router.get(
    "/:apiversion/:service",
    ...getMWs,
    async (req: Request, res: Response) => {
      await callService(HttpMethod.GET, req, res);
    }
  );

  // GET /api/v1/service-name/:id
  router.get(
    "/:apiversion/:service/:id",
    ...getMWs,
    async (req: Request, res: Response) => {
      await callService(HttpMethod.GET, req, res);
    }
  );

  // POST /api/v1/service-name
  router.post(
    "/:apiversion/:service",
    ...postMWs,
    async (req: Request, res: Response) => {
      await callService(HttpMethod.POST, req, res);
    }
  );

  // PATCH /api/v1/service-name/:id
  router.patch(
    "/:apiversion/:service/:id",
    ...patchMWs,
    async (req: Request, res: Response) => {
      await callService(HttpMethod.PATCH, req, res);
    }
  );

  // PUT /api/v1/service-name/:id
  router.put(
    "/:apiversion/:service/:id",
    ...putMWs,
    async (req: Request, res: Response) => {
      await callService(HttpMethod.PUT, req, res);
    }
  );

  // DELETE /api/v1/service-name/:id
  router.delete(
    "/:apiversion/:service/:id",
    ...deleteMWs,
    async (req: Request, res: Response) => {
      await callService(HttpMethod.DELETE, req, res);
    }
  );

  return router;
};
