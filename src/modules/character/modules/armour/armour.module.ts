import { Module } from "@nestjs/common";
import { ArmourService } from "./armour.service";
import { ArmourController } from "./armour.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Armour } from "./entities";

@Module({
  imports: [TypeOrmModule.forFeature([Armour])],
  providers: [ArmourService],
  controllers: [ArmourController],
})
export class ArmourModule {}
