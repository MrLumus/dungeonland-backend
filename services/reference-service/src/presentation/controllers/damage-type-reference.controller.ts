import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
  ParseIntPipe,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ApiTags, ApiOperation, ApiBearerAuth } from "@nestjs/swagger";
import { DamageTypeReferenceService } from "../../application/services";

@ApiTags("References/DamageTypes")
@Controller("damage-types")
export class DamageTypeReferenceController {
  constructor(private readonly service: DamageTypeReferenceService) {}

  @Get()
  @ApiOperation({ summary: "Get all damage type references" })
  findAll() {
    return this.service.findAll();
  }

  @Get(":id")
  @ApiOperation({ summary: "Get damage type reference by ID" })
  findOne(@Param("id", ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Get("code/:code")
  @ApiOperation({ summary: "Get damage type reference by code" })
  findByCode(@Param("code") code: string) {
    return this.service.findByCode(code);
  }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: "Create damage type reference" })
  create(@Body() dto: any) {
    return this.service.create(dto);
  }

  @Patch(":id")
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: "Update damage type reference" })
  update(
    @Param("id", ParseIntPipe) id: number,
    @Body() dto: any
  ) {
    return this.service.update(id, dto);
  }

  @Delete(":id")
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: "Delete damage type reference" })
  delete(@Param("id", ParseIntPipe) id: number) {
    return this.service.delete(id);
  }
}
