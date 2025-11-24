import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
  Request,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ApiTags, ApiOperation, ApiBearerAuth } from "@nestjs/swagger";
import { EquipmentService } from "../../application/services";
import { CreateEquipmentDto, UpdateEquipmentDto } from "../../application/dto";

@ApiTags("Characters/Equipment")
@Controller("characters/:characterId/equipment")
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth()
export class EquipmentController {
  constructor(private readonly service: EquipmentService) {}

  @Post()
  @ApiOperation({ summary: "Create Equipment for character" })
  create(
    @Request() req: any,
    @Param("characterId") characterId: string,
    @Body() dto: CreateEquipmentDto
  ) {
    return this.service.create(req.user.userId, characterId, dto);
  }

  @Get()
  @ApiOperation({ summary: "Get equipment for character" })
  findAll(@Request() req: any, @Param("characterId") characterId: string) {
    return this.service.findByCharacter(req.user.userId, characterId);
  }

  @Get(":id")
  @ApiOperation({ summary: "Get Equipment by ID" })
  findOne(@Request() req: any, @Param("id") id: string) {
    return this.service.findOne(req.user.userId, id);
  }

  @Patch(":id")
  @ApiOperation({ summary: "Update Equipment" })
  update(
    @Request() req: any,
    @Param("id") id: string,
    @Body() dto: UpdateEquipmentDto
  ) {
    return this.service.update(req.user.userId, id, dto);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Delete Equipment" })
  remove(@Request() req: any, @Param("id") id: string) {
    return this.service.delete(req.user.userId, id);
  }
}
