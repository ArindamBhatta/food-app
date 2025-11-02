export class CreateFoodInput {
  name!: string;
  description!: string;
  category!: string;
  foodType!: string;
  readyTime!: number;
  price!: number;
  constructor(data: any) {
    this.name = data?.name;
    this.description = data?.description;
    this.category = data?.category;
    this.foodType = data?.foodType;
    this.readyTime = Number(data?.readyTime);
    this.price = Number(data?.price);

    const errors: string[] = [];
    if (!this.name || typeof this.name !== "string")
      errors.push("name is required");
    if (!this.foodType || typeof this.foodType !== "string")
      errors.push("foodType is required");
    if (Number.isNaN(this.readyTime)) errors.push("readyTime must be a number");
    if (Number.isNaN(this.price)) errors.push("price must be a number");
    if (errors.length) {
      const err: any = new Error("Validation failed");
      err.name = "ValidationError";
      err.details = errors;
      throw err;
    }
  }
}

export class FoodResponse {
  id!: string;
  name!: string;
  description!: string;
  category!: string;
  foodType!: string;
  readyTime!: number;
  price!: number;
  rating!: number;
  images!: string[];
}

export class UpdateFoodInput {}

export class FoodResponseDto {}
