import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

@Injectable()
export class LocationRepository {
  async findById(
    tx: Prisma.TransactionClient,
    id: string,
  ) {
    return tx.location.findUnique({
      where: { id },
    });
  }
}