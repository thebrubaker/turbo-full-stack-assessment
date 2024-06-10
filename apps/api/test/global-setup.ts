import { v4 as uuidv4 } from 'uuid';
import { Test } from '@nestjs/testing';
import { PrismaService } from '../src/prisma/prisma.service';
import { execSync } from 'child_process';

export default async () => {
  global.Schema = `test_${uuidv4()}`;

  process.env.DATABASE_URL = process.env.DATABASE_URL.replace(
    'schema=public',
    `schema=${global.Schema}`,
  );

  const moduleRef = await Test.createTestingModule({
    imports: [], // Import your SeederModule if it's not a part of another module
    providers: [PrismaService],
  }).compile();

  const prisma = moduleRef.get<PrismaService>(PrismaService);

  try {
    execSync('npx prisma migrate deploy --schema ../../prisma/schema.prisma', {
      stdio: 'inherit',
    });
    await prisma.$connect();

    // seed data
  } finally {
    await prisma.$disconnect();
  }
};
