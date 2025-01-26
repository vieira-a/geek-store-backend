export class CustomerDto {
  name: string;
  gsic: string;
}

class CustomerData {
  name: string;
  gsic: string;
  email: string;
}
export class CustomerAuthenticatedDto {
  customer: CustomerData;
  token: string;
}
