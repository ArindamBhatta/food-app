import { CreateFoodInput } from "../../dto/interface/Food.dto";
import { FoodDoc } from "../../entities";

export default interface IFoodService {
  addFood(
    vendorId: string,
    input: CreateFoodInput,
    files: Express.Multer.File[]
  ): Promise<FoodDoc>;
  getFoods(vendorId: string): Promise<FoodDoc[]>;
}
