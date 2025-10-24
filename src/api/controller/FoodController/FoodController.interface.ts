import { ControllerPayload } from "../../../constants";

export default interface IFoodController {
  vendorAddFood: (payload: ControllerPayload) => any;
  vendorGetFoods: (payload: ControllerPayload) => any;
}
