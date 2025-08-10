export interface CreateFoodInput {
  name: string;
  description: string;
  category: string;
  foodType: string;
  readyTime: number;
  price: number;
}

export interface FullFoodInput extends CreateFoodInput {
  vendorId: string;
  images: string[];
  rating: number;
}
