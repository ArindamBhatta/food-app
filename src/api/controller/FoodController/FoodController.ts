import { ControllerPayload } from "../../../constants";
import { CreateFoodInput, FoodResponse } from "../../dto/interface/Food.dto";
import { AuthPayload } from "../../dto/Auth.dto";
import FoodService from "../../services/FoodService/FoodService";
import IFoodController from "./FoodController.interface";

export default class FoodController implements IFoodController {
  private foodService: FoodService;
  constructor(foodService: FoodService) {
    this.foodService = foodService;
  }

  vendorAddFood = async (payload: ControllerPayload) => {
    try {
      const user: AuthPayload | undefined = payload.req.user;
      if (!user) {
        return {
          status: 401,
          error: { message: "User not authenticated" },
        };
      }

      const files = payload.req.files as Express.Multer.File[];
      const createFoodInput: CreateFoodInput = new CreateFoodInput(
        payload.req.body
      );

      const createdFood = await this.foodService.addFood(
        user._id?.toString() as string,
        createFoodInput,
        files || []
      );

      const foodResponse: FoodResponse = {
        id: createdFood.id,
        name: createdFood.name,
        description: createdFood.description,
        category: createdFood.category,
        foodType: createdFood.foodType,
        readyTime: createdFood.readyTime,
        price: createdFood.price,
        rating: createdFood.rating,
        images: (createdFood.images as unknown as string[]) || [],
        createdAt: (createdFood as any).createdAt,
        updatedAt: (createdFood as any).updatedAt,
      };

      return {
        status: 201,
        food: foodResponse,
        message: "Food added successfully",
      };
    } catch (error: any) {
      console.error("Error in vendorAddFood:", error);
      return {
        status: 500,
        error: { message: "Internal server error", details: error.message },
      };
    }
  };

  vendorGetFoods = async (payload: ControllerPayload) => {
    try {
      const user: AuthPayload | undefined = payload.req.user;
      if (!user) {
        return {
          status: 401,
          error: { message: "User not authenticated" },
        };
      }

      const foods = await this.foodService.getFoods(
        user._id?.toString() as string
      );

      return {
        status: 200,
        foods,
        message: "Foods fetched successfully",
      };
    } catch (error: any) {
      console.error("Error in vendorGetFoods:", error);
      return {
        status: 500,
        error: { message: "Internal server error", details: error.message },
      };
    }
  };

  // getCurrentOrder = async (payload: ControllerPayload) => {
  //   try {
  //     const user: AuthPayload | undefined = payload.req.user;
  //     if (!user) {
  //       return {
  //         status: 401,
  //         error: { message: "User not authenticated" },
  //       };
  //     }

  //     const currentOrder = await this.foodService.getCurrentOrder(
  //       user._id?.toString() as string
  //     );

  //     return {
  //       status: 200,
  //       currentOrder,
  //       message: "Current order fetched successfully",
  //     };
  //   } catch (error: any) {
  //     console.error("Error in getCurrentOrder:", error);
  //     return {
  //       status: 500,
  //       error: { message: "Internal server error", details: error.message },
  //     };
  //   }
  // };

  // getCurrentOrder = async (payload: ControllerPayload) => {
  //   try {
  //     const user: AuthPayload | undefined = payload.req.user;
  //     if (!user) {
  //       return {
  //         status: 401,
  //         error: { message: "User not authenticated" },
  //       };
  //     }

  //     const currentOrder = await this.foodService.getCurrentOrder(
  //       user._id?.toString() as string
  //     );

  //     return {
  //       status: 200,
  //       currentOrder,
  //       message: "Current order fetched successfully",
  //     };
  //   } catch (error: any) {
  //     console.error("Error in getCurrentOrder:", error);
  //     return {
  //       status: 500,
  //       error: { message: "Internal server error", details: error.message },
  //     };
  //   }
  // };

  // getOrderById = async (payload: ControllerPayload) => {
  //   try {
  //     const user: AuthPayload | undefined = payload.req.user;
  //     if (!user) {
  //       return {
  //         status: 401,
  //         error: { message: "User not authenticated" },
  //       };
  //     }

  //     const order = await this.foodService.getOrderById(
  //       user._id?.toString() as string
  //     );

  //     return {
  //       status: 200,
  //       order,
  //       message: "Order fetched successfully",
  //     };
  //   } catch (error: any) {
  //     console.error("Error in getOrderById:", error);
  //     return {
  //       status: 500,
  //       error: { message: "Internal server error", details: error.message },
  //     };
  //   }
  // };
}
