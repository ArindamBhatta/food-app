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
    ...postMWs,
    async (req: Request, res: Response) => {
      await callService(HttpMethod.PATCH, req, res);
    }
  );

  return router;
};

// Helper to run an array of Express middlewares in order
const runMiddlewares = (
  mws: RequestHandler[],
  req: Request,
  res: Response
): Promise<void> => {
  return new Promise((resolve, reject) => {
    let idx = 0;
    const next: NextFunction = (err?: any) => {
      if (err) return reject(err);
      if (res.headersSent) return resolve();
      const mw = mws[idx++];
      if (!mw) return resolve();
      try {
        mw(req, res, next);
      } catch (e) {
        reject(e);
      }
    };
    next();
  });
};

const callService = async (method: HttpMethod, req: Request, res: Response) => {
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
      return res.status(400).json({ message: "Unsupported API version" });
  }

  if (!serviceDef) {
    return res.status(404).json({ message: "Service not found" });
  }

  try {
    // If serviceDef is an array, treat elements before last as middlewares, last as controller
    let data: any;
    if (Array.isArray(serviceDef)) {
      const mws = serviceDef.slice(
        0,
        serviceDef.length - 1
      ) as RequestHandler[];
      const controller = serviceDef[serviceDef.length - 1] as (
        payload: any
      ) => Promise<any>;
      // Run middlewares sequentially
      await runMiddlewares(mws, req, res);
      if (!res.headersSent) {
        data = await controller({ req, res });
        res.status(200).json({ success: true, data });
      }
    } else {
      data = await serviceDef({ req, res });
      res.status(200).json({ success: true, data });
    }
  } catch (error) {
    console.error("Error calling service:", error);
    if (error instanceof BusinessLogicError) {
      return res.status(400).json({ success: false, message: error.message });
    }

    // Handle authentication errors
    if (error instanceof Error && error.message === "Invalid credentials") {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
