import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Order } from '../schema/order.schema';
import { Model } from 'mongoose';
import { ProductServiceInterface } from 'src/module/product/interface/product-service.interface';
import { CreateOrderDto } from '../dto/create-order.dto';
import { CartServiceInterface } from 'src/module/cart/interface/cart-service.interface';
import { CustomerService } from 'src/module/customer/service/customer.service';
import { OrderException } from '../exception/order.exception';
import { generateInternalCode } from 'src/module/shared/helper/generate-internal-code.helper';

@Injectable()
export class OrderService {
  constructor(
    @InjectModel(Order.name) private readonly orderModel: Model<Order>,
    @Inject('ProductService')
    private readonly productService: ProductServiceInterface,
    @Inject('CartService') private readonly cartService: CartServiceInterface,
    @Inject('CustomerService')
    private readonly customerService: CustomerService,
  ) {}

  async createOrder(createOrderDto: CreateOrderDto) {
    const { cartGsic, customerGsic } = createOrderDto;

    const cart = await this.cartService.findByGsic(cartGsic);

    if (!cart) {
      throw new OrderException('Carrinho não encontrado', HttpStatus.NOT_FOUND);
    }

    const customer = await this.customerService.findByGsic(customerGsic);

    if (!customer) {
      throw new OrderException('Cliente não encontrado', HttpStatus.NOT_FOUND);
    }

    const customerCart = await this.customerService.findCustomerCart(
      customer.id,
      cart.id,
    );

    if (!customerCart) {
      throw new OrderException(
        'Carrinho não encontrado para o cliente',
        HttpStatus.NOT_FOUND,
      );
    }

    const updatedItems = await this.cartService.recalculateCartItems(
      cart.items,
    );
    const totalItems = updatedItems.reduce(
      (acc, item) => acc + item.quantity,
      0,
    );
    const totalPrice = updatedItems.reduce(
      (acc, item) => acc + item.subtotal,
      0,
    );

    const orderExists = await this.orderModel.findOne({ cartId: cart.id });

    if (orderExists) {
      throw new OrderException(
        'Pedido de compra já existe',
        HttpStatus.CONFLICT,
      );
    }

    const order = await this.orderModel.create({
      gsic: generateInternalCode('ORR'),
      cartId: cart.id,
      customerId: customer.id,
      items: updatedItems,
      totalItems,
      totalPrice,
    });

    const savedOrder = await order.save();

    if (savedOrder) {
      for (const item of updatedItems) {
        await this.productService.decreaseStock(item.gsic, item.quantity);
        await this.cartService.finishCart(savedOrder.cartId);
        await this.customerService.finishCustomerCart(
          savedOrder.customerId,
          savedOrder.cartId,
        );
      }
    }
    return savedOrder;
  }
}
