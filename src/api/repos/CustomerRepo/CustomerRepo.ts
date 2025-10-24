import { Customer, CustomerDoc } from "../../entities/Customer";
import ICustomerRepo from "./CustomerRepo.interface";

export default class CustomerRepo implements ICustomerRepo {
  private db: typeof Customer;

  constructor(db: typeof Customer) {
    this.db = db;
  }

  existingCustomer = async (
    email?: string,
    phone?: string,
    id?: string
  ): Promise<CustomerDoc | null> => {
    const query: any = { $or: [] };
    
    if (email) query.$or.push({ email });
    if (phone) query.$or.push({ phone });
    if (id) query.$or.push({ _id: id });
    
    // Exclude current user when updating
    if (id) {
      query._id = { $ne: id };
    }
    
    // If no search criteria provided, return null
    if (query.$or.length === 0) return null;
    
    return this.db.findOne(query);
  };

  createCustomer = async (data: Partial<CustomerDoc>): Promise<CustomerDoc> => {
    return this.db.create(data);
  };

  verifyOtp = async (
    customerId: string,
    otp: number
  ): Promise<CustomerDoc | null> => {
    const customer = await this.db.findById(customerId);
    if (!customer) return null;
    if (customer.otp === otp && customer.otp_expiry >= new Date()) {
      customer.verified = true;
      return await customer.save();
    }
    return null;
  };
}
