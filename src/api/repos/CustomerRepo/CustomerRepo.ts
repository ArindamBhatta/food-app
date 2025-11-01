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
    // If searching by ID only, use direct findById for better performance
    if (id && !email && !phone) {
      return this.db.findById(id);
    }
    
    const query: any = { $or: [] };
    
    if (email) query.$or.push({ email });
    if (phone) query.$or.push({ phone });
    if (id) query.$or.push({ _id: id });
    
    // If no search criteria provided, return null
    if (query.$or.length === 0) return null;
    
    return this.db.findOne(query);
  };

  createCustomer = async (data: Partial<CustomerDoc>): Promise<CustomerDoc> => {
    return this.db.create(data);
  };

  verifyOtp = async (
    otp: number,
    email?: string,
    phone?: string,
    customerId?: string
  ): Promise<CustomerDoc | null> => {
    let customer: CustomerDoc | null = null;
    
    // Find customer by email, phone, or ID
    if (customerId) {
      customer = await this.db.findById(customerId);
    } else if (email || phone) {
      const query: any = { $or: [] };
      if (email) query.$or.push({ email });
      if (phone) query.$or.push({ phone });
      customer = await this.db.findOne(query);
    }
    
    if (!customer) return null;
    
    // Verify OTP and check expiry
    if (customer.otp === otp && customer.otp_expiry >= new Date()) {
      customer.verified = true;
      return await customer.save();
    }
    return null;
  };
}
