import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsStrongPassword,
} from 'class-validator';

export class CreateCustomerDto {
  @ApiProperty({ name: 'name', description: 'Nome do cliente' })
  @IsNotEmpty({ message: 'Nome é obrigatório' })
  name: string;

  @ApiProperty({ name: 'email', description: 'Email do cliente' })
  @IsEmail({}, { message: 'Email inválido' })
  @IsNotEmpty({ message: 'Email é obrigatório' })
  email: string;

  @ApiProperty({ name: 'phone', description: 'Telefone do cliente' })
  @IsOptional()
  phone?: string;

  @ApiProperty({ name: 'password', description: 'Senha do cliente' })
  @IsStrongPassword({}, { message: 'Senha fraca' })
  password: string;

  @ApiProperty({
    name: 'passwordConfirmation',
    description: 'Confirmação de senha do cliente',
  })
  @IsStrongPassword({}, { message: 'Confirmação de senha fraca' })
  passwordConfirmation: string;
}
