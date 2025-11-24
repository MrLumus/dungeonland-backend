import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import ormconfig from "./infrastructure/config/ormconfig";
import { PersonalityModule } from "./presentation/modules/personality.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env'
    }),
    TypeOrmModule.forRoot({ ...(ormconfig as any) }),
    PersonalityModule,
  ],
})
export class AppModule {}
