import { Module } from "@nestjs/common";
import { ReferenceController } from "./reference.controller";
import { ReferenceService } from "./reference.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { SkillReference, StatReference } from "./entities";

@Module({
  imports: [TypeOrmModule.forFeature([StatReference, SkillReference])],
  controllers: [ReferenceController],
  providers: [ReferenceService],
})
export class ReferenceModule {}
