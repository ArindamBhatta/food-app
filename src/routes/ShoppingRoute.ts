import express, { Request, Response, NextFunction } from "express";
import {
  GetFoodAvailability,
  GetFoodsIn30Min,
  GetTopRestaurants,
  RestaurantById,
  SearchFoods,
} from "../controller";

const router = express.Router();

// ---------- Food Availability --------------

router.get("/:pincode", (req: Request, res: Response, next: NextFunction) => {
  GetFoodAvailability(req, res).catch(next);
});

// --------- Top Restaurants -----------------
router.get(
  "/top-restaurants/:pincode",
  (req: Request, res: Response, next: NextFunction) => {
    GetTopRestaurants(req, res).catch(next);
  }
);

// -------- Food Available in 30 minutes ------
router.get(
  "/foods-in-30-min/:pincode",
  (req: Request, res: Response, next: NextFunction) => {
    GetFoodsIn30Min(req, res).catch(next);
  }
);

// ------- Search Foods ------
router.get(
  "/search/:pincode",
  (req: Request, res: Response, next: NextFunction) => {
    SearchFoods(req, res).catch(next);
  }
);

// ------- Find Restorenet by Id ---------
router.get(
  "/restaurant/:id",
  (req: Request, res: Response, next: NextFunction) => {
    RestaurantById(req, res).catch(next);
  }
);

//default route
router.get("/", (req: Request, res: Response, next: NextFunction) => {
  res.json({ message: "Hello from Shopping" });
});

export { router as ShoppingRoute };
