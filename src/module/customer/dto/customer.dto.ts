export class CustomerDto {
  name: string;
  gsic: string;
}

export class CustomerAuthenticatedDto {
  name: string;
  gsic: string;
  email: string;
  token: string;
}
