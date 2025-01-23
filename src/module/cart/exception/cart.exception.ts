import { HttpException, HttpStatus } from '@nestjs/common';

export class CartException extends HttpException {
  constructor(message: string, statusCode: HttpStatus) {
    super(message, statusCode);
    this.name = 'CartException';
  }
}
