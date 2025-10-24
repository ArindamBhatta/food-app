import { CustomerDoc } from "../../entities/Customer";
import { CreateCustomerDTO } from "../../dto/interface/Customer.dto";

export default interface ICustomerService {
  signUp(
    input: CreateCustomerDTO
  ): Promise<{ customer: CustomerDoc; otp: number }>;
  verifyOtp(
    customerId: string,
    otp: number
  ): Promise<{ customer: CustomerDoc | null; signature?: string }>;
}
