import { HttpException, HttpStatus } from '@nestjs/common';

export class ProductException extends HttpException {
  constructor(message: string, statusCode: HttpStatus) {
    super(message, statusCode);
    this.name = 'ProductException';
  }
}
