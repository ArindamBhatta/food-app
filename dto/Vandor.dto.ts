//DTO (Data Transfer Object)  => Defines the structure of data coming INTO your API
//Defining what clients can send to your API
//Input validation and sanitization
//The DTO acts as a contract for incoming data. When you send data from Postman, the DTO helps your API recognize and report errors in the request, making your API safer and easier to use!

export interface CreateVendorInput {
  name: string;
  ownerName: string;
  foodType: [string];
  pincode: string;
  address: string;
  phone: string;
  email: string;
  password: string;
}

export interface VendorLoginInputs {
  email: string;
  password: string;
}

export interface VendorPayload {
  _id: string;
  email: string;
  name: string;
  foodTypes: [string];
}

export interface EditVendorInputs {
  name: string;
  address: string;
  phone: string;
  foodTypes: [string];
}
