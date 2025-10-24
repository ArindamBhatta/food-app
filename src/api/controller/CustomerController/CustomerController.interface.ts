import { ControllerPayload } from "../../../constants";

export default interface ICustomerController {
  signUp: (payload: ControllerPayload) => any;
  otpVerify: (payload: ControllerPayload) => any;
}
