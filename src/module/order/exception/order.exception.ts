import { HttpException, HttpStatus } from '@nestjs/common';

export class OrderException extends HttpException {
  constructor(message: string, statusCode: HttpStatus) {
    super(message, statusCode);
    this.name = 'OrderException';
  }
}
