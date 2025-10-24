import { ControllerPayload } from "../../../constants";

export default interface ICustomerController {
  AddToCart: (payload: ControllerPayload) => any;
  signUp: (payload: ControllerPayload) => any;
  otpVerify: (payload: ControllerPayload) => any;
}
