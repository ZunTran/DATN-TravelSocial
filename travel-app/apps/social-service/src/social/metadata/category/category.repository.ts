import { Injectable } from '@nestjs/common';
import { Prisma, category } from '@prisma/client';

@Injectable()
export class CategoryRepository {
  async findById(tx: Prisma.TransactionClient,
    id: string ) {
    return tx.category.findUnique({where: { id });
  }

  async exists(tx: Prisma.TransactionClient,id: string,): Promise<boolean> {
  const category = await tx.category.findUnique({
    where: { id },
    select: { id: true },
  });
  return !!category;
  }
  
}