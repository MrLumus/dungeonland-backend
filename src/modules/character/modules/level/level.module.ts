import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Level } from "./entities";
import { LevelController } from "./level.controller";
import { LevelService } from "./level.service";

@Module({
  imports: [TypeOrmModule.forFeature([Level])],
  controllers: [LevelController],
  providers: [LevelService],
})
export class LevelModule {}
