import express, { Request, Response, IRoute } from "express";
import { HttpMethod, ApiVersion } from "../constants";
import { auth } from "./middleware/auth";
import route from "./route";

const router = express.Router();

export default (): IRoute => {
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
        serviceDef = route[method]?.[serviceName];
        break;
      case ApiVersion.V2:
        serviceDef = route[method]?.[serviceName];
        break;
      default:
        serviceDef = undefined;
    }
  };
};
