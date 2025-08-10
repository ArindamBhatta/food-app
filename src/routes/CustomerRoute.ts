import express, { Request, Response, NextFunction } from "express";
import {
  CustomerSignUp,
  CustomerVerify,
  EditCustomerProfile,
  getCustomerProfile,
  RequestOtp,
} from "../controller";
import { Authenticate } from "../middlewares/Controller";

const router = express.Router();

// -- Sign up / Create customer

router.post("/signup", (req: Request, res: Response, next: NextFunction) => {
  CustomerSignUp(req, res).catch(next);
});

//-- login
router.post("/login", (req: Request, res: Response, next: NextFunction) => {});

// authentication
router.use(Authenticate);

//verify customer account
router.post("/verify", (req: Request, res: Response, next: NextFunction) => {
  CustomerVerify(req, res).catch(next);
});

//otp / Request otp
router.post("/otp", (req: Request, res: Response, next: NextFunction) => {
  RequestOtp(req, res).catch(next);
});

//profile get

router.get("/profile", (req: Request, res: Response, next: NextFunction) => {
  getCustomerProfile(req, res).catch(next);
});

//profile update

router.patch("/profile", (req: Request, res: Response, next: NextFunction) => {
  EditCustomerProfile(req, res).catch(next);
});

// order
router.post(
  "/create-order",
  (req: Request, res: Response, next: NextFunction) => {}
);

export { router as CustomerRoute };
