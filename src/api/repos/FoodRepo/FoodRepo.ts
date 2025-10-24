import { Food, FoodDoc, Vendor, VendorDoc } from "../../entities";
import { CreateFoodInput } from "../../dto/interface/Food.dto";
import IFoodRepo from "./FoodRepo.interface";

export default class FoodRepo implements IFoodRepo {
  private foodDb: typeof Food;
  private vendorDb: typeof Vendor;

  constructor(foodDb: typeof Food, vendorDb: typeof Vendor) {
    this.foodDb = foodDb;
    this.vendorDb = vendorDb;
  }

  addFood = async (
    vendorId: string,
    input: CreateFoodInput,
    imageUrls: string[]
  ): Promise<FoodDoc> => {
    try {
      // create food first
      const createdFood = await this.foodDb.create({
        vendorId,
        name: input.name,
        description: input.description,
        category: input.category,
        foodType: input.foodType,
        readyTime: input.readyTime,
        images: imageUrls,
        price: input.price,
        rating: 0,
      });

      // link food to vendor
      const vendor: VendorDoc | null = await this.vendorDb.findById(vendorId);
      if (!vendor) {
        throw new Error("Vendor not found for linking food");
      }
      (vendor as any).foods.push(createdFood);
      await (vendor as any).save();

      return createdFood;
    } catch (error) {
      console.error("Error in FoodRepo.addFood:", error);
      throw new Error("Database error occurred");
    }
  };

  getFoods = async (vendorId: string): Promise<FoodDoc[]> => {
    try {
      const foods = await this.foodDb.find({ vendorId });
      return foods as unknown as FoodDoc[];
    } catch (error) {
      console.error("Error in FoodRepo.getFoods:", error);
      throw new Error("Database error occurred");
    }
  };
}
