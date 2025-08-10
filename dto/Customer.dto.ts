import { IsEmail, IsPhoneNumber, Length } from "class-validator";

export class CreateCustomerInput {
  @IsEmail()
  email: string;

  @Length(6, 20)
  password: string;

  @IsPhoneNumber("IN")
  phone: string;
}

export interface CustomerPayload {
  _id: string;
  email: string;
  verified: boolean;
}
