import express, { Request, Response, NextFunction } from "express";
import { CustomerSignUp } from "../controller";

const router = express.Router();

// -- Sign up

router.post("/signup", (req: Request, res: Response, next: NextFunction) => {
  CustomerSignUp(req, res).catch(next);
});

//-- login

router.post("/login", (req: Request, res: Response, next: NextFunction) => {});

router.get("/", (req: Request, res: Response, next: NextFunction) => {
  res.json({ message: "Hello from Customer" });
});

export { router as CustomerRoute };
