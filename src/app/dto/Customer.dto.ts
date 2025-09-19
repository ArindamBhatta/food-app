import { IsEmail, IsPhoneNumber, Length } from "class-validator";

//Signup Dto
export class CreateCustomerInput {
  @IsEmail()
  email: string;

  @Length(6, 20)
  password: string;

  @IsPhoneNumber("IN")
  phone: string;
}

//login Dto
export class UserLoginInputs {
  @IsEmail()
  email: string;

  @Length(6, 20)
  password: string;
}
//edit profile
export class EditCustomerProfileInputs {
  @Length(3, 20)
  firstName: string;
  @Length(3, 20)
  lastName: string;
  @Length(10, 100)
  address: string;
}

export interface CustomerPayload {
  _id: string;
  email: string;
  verified: boolean;
}

export class OrderInputs {
  _id: string;
  unit: number;
}
