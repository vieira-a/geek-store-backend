import { HttpException, HttpStatus } from '@nestjs/common';

export class CustomerException extends HttpException {
  constructor(message: string, statusCode: HttpStatus) {
    super(message, statusCode);
    this.name = 'CustomerException';
  }
}
