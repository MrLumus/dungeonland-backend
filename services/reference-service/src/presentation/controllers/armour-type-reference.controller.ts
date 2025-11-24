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
import { ArmourTypeReferenceService } from "../../application/services";

@ApiTags("References/ArmourTypes")
@Controller("armour-types")
export class ArmourTypeReferenceController {
  constructor(private readonly service: ArmourTypeReferenceService) {}

  @Get()
  @ApiOperation({ summary: "Get all armour type references" })
  findAll() {
    return this.service.findAll();
  }

  @Get(":id")
  @ApiOperation({ summary: "Get armour type reference by ID" })
  findOne(@Param("id", ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Get("code/:code")
  @ApiOperation({ summary: "Get armour type reference by code" })
  findByCode(@Param("code") code: string) {
    return this.service.findByCode(code);
  }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: "Create armour type reference" })
  create(@Body() dto: any) {
    return this.service.create(dto);
  }

  @Patch(":id")
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: "Update armour type reference" })
  update(
    @Param("id", ParseIntPipe) id: number,
    @Body() dto: any
  ) {
    return this.service.update(id, dto);
  }

  @Delete(":id")
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: "Delete armour type reference" })
  delete(@Param("id", ParseIntPipe) id: number) {
    return this.service.delete(id);
  }
}
