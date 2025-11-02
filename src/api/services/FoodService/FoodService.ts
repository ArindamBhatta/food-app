import { FoodDoc, VendorDoc } from "../../entities";
import { CreateFoodInput } from "../../dto/interface/Food.dto";
import VendorRepo from "../../repos/VendorRepo/VendorRepo";
import { UploadApiErrorResponse, UploadApiResponse } from "cloudinary";
import { uploadBuffer } from "../../utils/UploadPicture.utility";
import IFoodService from "./FoodService.interface";
import FoodRepo from "../../repos/FoodRepo/FoodRepo";

export default class FoodService implements IFoodService {
  private vendorRepo: VendorRepo;
  private foodRepo: FoodRepo;

  constructor(vendorRepo: VendorRepo, foodRepo: FoodRepo) {
    this.vendorRepo = vendorRepo;
    this.foodRepo = foodRepo;
  }

  addFood = async (
    vendorId: string,
    input: CreateFoodInput,
    files: Express.Multer.File[]
  ): Promise<FoodDoc> => {
    // 1) find vendor
    const vendor: VendorDoc | null = await this.vendorRepo.findVendor({
      vendorId,
    });
    if (!vendor) {
      throw new Error("Vendor not found");
    }

    // 2) UploadApiResponse is prepare
    const uploads: Promise<UploadApiResponse>[] = files.map((file) =>
      uploadBuffer(file, "food-image")
    );
    const results: UploadApiResponse[] = await Promise.all(uploads);
    const imageUrls: string[] = results.map(
      (image_uri) => image_uri.secure_url
    );

    // 3) call repo layer
    const createdFood = await this.foodRepo.addFood(vendorId, input, imageUrls);
    return createdFood;
  };

  getFoods = async (vendorId: string) => {
    const vendor: VendorDoc | null = await this.vendorRepo.findVendor({
      vendorId,
    });
    if (!vendor) {
      throw new Error("Vendor not found");
    }
    return this.foodRepo.getFoods(vendorId);
  };
}
