import { Module } from "@nestjs/common";
import { PrismaModule } from "../../prisma/prisma.module";
import { BlockRepository } from "./block.repository";


@Module({
  imports: [PrismaModule],
  providers: [BlockRepository,],
  exports: [BlockRepository],
})
export class BlockModule {}