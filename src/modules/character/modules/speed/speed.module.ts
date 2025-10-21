import { Module } from "@nestjs/common";
import { SpeedService } from "./speed.service";
import { SpeedController } from "./speed.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Speed } from "./entities";

@Module({
  imports: [TypeOrmModule.forFeature([Speed])],
  providers: [SpeedService],
  controllers: [SpeedController],
})
export class SpeedModule {}
