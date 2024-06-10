import { PrismaService } from '@/prisma/prisma.service';
import { Controller } from '@nestjs/common';

@Controller('users')
export class UsersController {
  constructor(private readonly prisma: PrismaService) {}
}
