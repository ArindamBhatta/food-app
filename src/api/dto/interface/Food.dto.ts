export class CreateFoodInput {
  name!: string;
  description!: string;
  category!: string;
  foodType!: string;
  readyTime!: number;
  price!: number;
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
  createdAt!: Date;
  updatedAt!: Date;
}

export class UpdateFoodInput {}

export class FoodResponseDto {}
