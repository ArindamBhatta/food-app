import express, {
  Request,
  Response,
  IRouter,
  NextFunction,
  RequestHandler,
} from "express";
import { RouteDefinition } from "./route";
import { HttpMethod, ApiVersion } from "../constants";
import routes from "./route";
import { BusinessLogicError } from "./utils/Error";

const router = express.Router();

export default (): IRouter => {
  // Apply authentication to GET routes (e.g., protected resources like vendor profile)
  const getMWs: RequestHandler[] = [];
  // Leave POST routes unauthenticated here (e.g., login). Apply per-route auth if needed.
  const postMWs: RequestHandler[] = [];

  const patchMWs: RequestHandler[] = [];

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

  // Route for PATCH requests
  router.patch(
    "/:apiversion/:service/:id?",
    ...patchMWs,
    async (req: Request, res: Response) => {
      await callService(HttpMethod.PATCH, req, res);
    }
  );

  return router;
};

const callService = async (
  method: HttpMethod,
  req: Request,
  res: Response
) => {
  const apiVersion: string = req.params.apiversion || ApiVersion.V1;
  const serviceName: string = req.params.service;
  console.log("callService", { method, serviceName });

  let serviceDef: RouteDefinition | undefined;

  switch (apiVersion) {
    case ApiVersion.V1:
    case ApiVersion.V2:
      serviceDef = routes[method]?.[serviceName];
      break;
    default:
      return res.status(400).json({ success: false, message: "Unsupported API version" });
  }

  if (!serviceDef) {
    return res.status(404).json({ success: false, message: "Service not found" });
  }

  try {
    // Build a payload that our controllers expect
    const payload = { req, res } as any;

    let result: any;

    if (Array.isArray(serviceDef)) {
      // If an array, treat everything except the last item as middleware
      const middlewares = serviceDef.slice(0, -1) as RequestHandler[];
      const controller = serviceDef[serviceDef.length - 1] as any;

      // Execute middlewares sequentially (they may mutate req/res)
      for (const mw of middlewares) {
        await new Promise<void>((resolve, reject) => {
          (mw as RequestHandler)(req, res, (err?: any) => {
            if (err) {
              reject(err);
            } else {
              resolve();
            }
          });
        });
        // If middleware already sent a response, stop further processing
        if (res.headersSent) return;
      }

      // Execute controller
      result = await controller(payload);
    } else {
      // Single controller function
      const controller = serviceDef as any;
      result = await controller(payload);
    }

    // If the controller already handled the response
    if (res.headersSent) return;

    if (result && typeof result === "object" && "status" in result) {
      const { status, ...data } = result as { status: number } & Record<string, any>;
      return res.status(status as number).json({ success: true, ...data });
    }

    return res.status(200).json({ success: true, data: result });
  } catch (error: any) {
    console.error("callService error:", error);
    if (error instanceof BusinessLogicError) {
      return res
        .status(error.statusCode)
        .json({ success: false, message: error.message });
    }
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};
