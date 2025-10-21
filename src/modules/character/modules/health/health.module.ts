import { Module } from "@nestjs/common";
import { HealthController } from "./health.controller";
import { HealthService } from "./health.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Health } from "./entities";

@Module({
  imports: [TypeOrmModule.forFeature([Health])],
  controllers: [HealthController],
  providers: [HealthService],
})
export class HealthModule {}
