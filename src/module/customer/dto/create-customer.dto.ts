import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsStrongPassword,
} from 'class-validator';

export class CreateCustomerDto {
  @IsNotEmpty({ message: 'Nome é obrigatório' })
  name: string;

  @IsEmail({}, { message: 'Email inválido' })
  @IsNotEmpty({ message: 'Email é obrigatório' })
  email: string;

  @IsOptional()
  phone?: string;

  @IsStrongPassword({}, { message: 'Senha fraca' })
  password: string;

  @IsStrongPassword({}, { message: 'Confirmação de senha fraca' })
  passwordConfirmation: string;
}
