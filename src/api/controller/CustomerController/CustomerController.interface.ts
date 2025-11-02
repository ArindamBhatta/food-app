import { ControllerPayload } from "../../../constants";

export default interface ICustomerController {
  signUp: (payload: ControllerPayload) => any;
  otpVerify: (payload: ControllerPayload) => any;
  signIn: (payload: ControllerPayload) => any;
  addToCart: (payload: ControllerPayload) => any;
}
