import { CartDto } from 'src/module/cart/dto/cart.dto';
import { CreateCustomerDto } from '../dto/create-customer.dto';
import { CustomerAuthenticatedDto, CustomerDto } from '../dto/customer.dto';
import { CustomerCart } from '../schema/customer-cart.schema';
import { Customer } from '../schema/customer.schema';
export interface CustomerServiceInterface {
  create(createCustomerDto: CreateCustomerDto): Promise<CustomerDto>;
  login(email: string, password: string): Promise<CustomerAuthenticatedDto>;
  findCustomerCart(
    customerId: string,
    cartId: string,
  ): Promise<CustomerCart | null>;
  findByGsic(gsic: string): Promise<Customer | null>;
  finishCustomerCart(customerId: string, cartId: string): Promise<void>;
}
