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
import { StatReferenceService } from "../../application/services";

@ApiTags("References/Stats")
@Controller("stats")
export class StatReferenceController {
  constructor(private readonly service: StatReferenceService) {}

  @Get()
  @ApiOperation({ summary: "Get all stat references" })
  findAll() {
    return this.service.findAll();
  }

  @Get(":id")
  @ApiOperation({ summary: "Get stat reference by ID" })
  findOne(@Param("id", ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Get("code/:code")
  @ApiOperation({ summary: "Get stat reference by code" })
  findByCode(@Param("code") code: string) {
    return this.service.findByCode(code);
  }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: "Create stat reference" })
  create(@Body() dto: any) {
    return this.service.create(dto);
  }

  @Patch(":id")
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: "Update stat reference" })
  update(
    @Param("id", ParseIntPipe) id: number,
    @Body() dto: any
  ) {
    return this.service.update(id, dto);
  }

  @Delete(":id")
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: "Delete stat reference" })
  delete(@Param("id", ParseIntPipe) id: number) {
    return this.service.delete(id);
  }
}
