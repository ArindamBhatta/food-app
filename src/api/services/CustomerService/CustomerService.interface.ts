import { CustomerDoc } from "../../models/CustomerModel";
import { CreateCustomerDTO } from "../../dto/interface/Customer.dto";

export default interface ICustomerService {
  signUp(
    input: CreateCustomerDTO
  ): Promise<{ customer: CustomerDoc; otp: number }>;
  verifyOtp(
    otp: number,
    email?: string,
    phone?: string,
    customerId?: string
  ): Promise<{ customer: CustomerDoc | null; signature?: string }>;
}
