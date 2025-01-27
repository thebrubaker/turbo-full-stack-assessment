import { IsEmail } from 'class-validator';

export class CreateUser {
  @IsEmail()
  email: string;
}
