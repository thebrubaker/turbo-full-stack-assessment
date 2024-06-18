import { PrismaService } from '@/prisma/prisma.service';
import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateUser } from './dto/create-user';

@Controller('users')
export class UsersController {
  constructor(private readonly prisma: PrismaService) {}

  @Post()
  create(@Body() body: CreateUser) {
    return this.prisma.user.create({
      data: {
        email: body.email,
        firstName: body.firstName,
        lastName: body.lastName,
        password: body.password,
      },
    });
  }

  @Get()
  list() {
    return this.prisma.user.findMany();
  }
}
