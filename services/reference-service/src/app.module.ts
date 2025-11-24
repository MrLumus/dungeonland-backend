import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import ormconfig from "./infrastructure/config/ormconfig";
import { StatReferenceModule } from "./presentation/modules/statreference.module";
import { EquipmentTypeReferenceModule } from "./presentation/modules/equipment-type-reference.module";
import { ArmourTypeReferenceModule } from "./presentation/modules/armour-type-reference.module";
import { DamageTypeReferenceModule } from "./presentation/modules/damage-type-reference.module";
import { DiceTypeReferenceModule } from "./presentation/modules/dice-type-reference.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env'
    }),
    TypeOrmModule.forRoot({ ...(ormconfig as any) }),
    StatReferenceModule,
    EquipmentTypeReferenceModule,
    ArmourTypeReferenceModule,
    DamageTypeReferenceModule,
    DiceTypeReferenceModule,
  ],
})
export class AppModule {}
