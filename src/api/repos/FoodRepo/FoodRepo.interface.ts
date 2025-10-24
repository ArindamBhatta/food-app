import { CreateFoodInput } from "../../dto/interface/Food.dto";
import { FoodDoc } from "../../entities";

export default interface IFoodRepo {
  addFood(
    vendorId: string,
    input: CreateFoodInput,
    imageUrls: string[]
  ): Promise<FoodDoc>;
  getFoods(vendorId: string): Promise<FoodDoc[]>;
}
