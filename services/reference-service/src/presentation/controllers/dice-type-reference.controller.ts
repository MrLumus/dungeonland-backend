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
import { DiceTypeReferenceService } from "../../application/services";

@ApiTags("References/DiceTypes")
@Controller("dice-types")
export class DiceTypeReferenceController {
  constructor(private readonly service: DiceTypeReferenceService) {}

  @Get()
  @ApiOperation({ summary: "Get all dice type references" })
  findAll() {
    return this.service.findAll();
  }

  @Get(":id")
  @ApiOperation({ summary: "Get dice type reference by ID" })
  findOne(@Param("id", ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Get("code/:code")
  @ApiOperation({ summary: "Get dice type reference by code" })
  findByCode(@Param("code") code: string) {
    return this.service.findByCode(code);
  }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: "Create dice type reference" })
  create(@Body() dto: any) {
    return this.service.create(dto);
  }

  @Patch(":id")
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: "Update dice type reference" })
  update(
    @Param("id", ParseIntPipe) id: number,
    @Body() dto: any
  ) {
    return this.service.update(id, dto);
  }

  @Delete(":id")
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: "Delete dice type reference" })
  delete(@Param("id", ParseIntPipe) id: number) {
    return this.service.delete(id);
  }
}
