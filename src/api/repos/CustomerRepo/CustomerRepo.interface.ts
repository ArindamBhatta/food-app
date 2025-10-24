import { CustomerDoc } from "../../entities/Customer";

export default interface ICustomerRepo {
  existingCustomer(email?: string, phone?: string, id?: string): Promise<CustomerDoc | null>;
  createCustomer(data: Partial<CustomerDoc>): Promise<CustomerDoc>;
  verifyOtp(customerId: string, otp: number): Promise<CustomerDoc | null>;
}
