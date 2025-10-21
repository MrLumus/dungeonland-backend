import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import ormconfig from "../ormconfig";
import { AuthModule } from "@auth/auth.module";
import { CharacterModule } from "@character/character.module";
import { NormalizeModule } from "@normalize/normalize.module";
import { ReferenceModule } from "@reference/reference.module";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({ ...(ormconfig as any) }),
    AuthModule,
    CharacterModule,
    NormalizeModule,
    ReferenceModule,
  ],
})
export class AppModule {}
