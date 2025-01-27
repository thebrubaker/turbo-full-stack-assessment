import { PrismaService } from '@/prisma/prisma.service';
import { Controller, Get, Param } from '@nestjs/common';

@Controller('users')
export class UsersController {
  constructor(private readonly prisma: PrismaService) {}

  @Get(':id')
  async getUserById(@Param('id') id: string) {
    const user = await this.prisma.user.findUniqueOrThrow({
      where: { id: parseInt(id) },
    });

    return user;
  }
}
