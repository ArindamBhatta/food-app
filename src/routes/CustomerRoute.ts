import express, { Request, Response, NextFunction } from "express";
import {
  CustomerSignUp,
  CustomerLogin,
  CustomerVerify,
  EditCustomerProfile,
  getCustomerProfile,
  RequestOtp,
  CreateOrder,
  GetOrders,
  GetOrderById,
  AddToCard,
  GetCard,
  DeleteCard,
} from "../controller";
import { Authenticate } from "../middlewares/Controller";

const router = express.Router();

// -- Sign up / Create customer

router.post("/signup", (req: Request, res: Response, next: NextFunction) => {
  CustomerSignUp(req, res).catch(next);
});

//-- Login
router.post("/login", (req: Request, res: Response, next: NextFunction) => {
  CustomerLogin(req, res).catch(next);
});

// middleware ------- authentication -----------
router.use(Authenticate);

//verify customer account
router.post("/verify", (req: Request, res: Response, next: NextFunction) => {
  CustomerVerify(req, res).catch(next);
});

//----------- Request otp --------
router.get("/otp", (req: Request, res: Response, next: NextFunction) => {
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

// ---------------------------- Card ------------------

router.post("/card", (req: Request, res: Response, next: NextFunction) => {
  AddToCard(req, res);
});
router.get("/card", (req: Request, res: Response, next: NextFunction) => {
  GetCard(req, res);
});
router.delete("/card", (req: Request, res: Response, next: NextFunction) => {
  DeleteCard(req, res);
});

// order
router.post(
  "/create-order",
  (req: Request, res: Response, next: NextFunction) => {
    CreateOrder(req, res);
  }
);

router.get("/orders", (req: Request, res: Response, next: NextFunction) => {
  GetOrders(req, res);
});

router.get("/order/:id", (req: Request, res: Response, next: NextFunction) => {
  GetOrderById(req, res);
});

export { router as CustomerRoute };
