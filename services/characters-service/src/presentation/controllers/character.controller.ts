import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from "@nestjs/swagger";
import { CharacterService } from "../../application/services";
import { CreateCharacterDto, UpdateCharacterDto } from "../../application/dto";

/**
 * Character Controller
 * Handles HTTP requests for character management
 */
@ApiTags("Characters")
@Controller("characters")
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth()
export class CharacterController {
  constructor(private readonly characterService: CharacterService) {}

  @Post()
  @ApiOperation({ summary: "Create a new character" })
  @ApiResponse({ status: 201, description: "Character created successfully" })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  create(@Request() req: any, @Body() dto: CreateCharacterDto) {
    return this.characterService.create(req.user.userId, dto);
  }

  @Get()
  @ApiOperation({ summary: "Get all characters for current user" })
  @ApiResponse({ status: 200, description: "Characters retrieved successfully" })
  findAll(@Request() req: any) {
    return this.characterService.findAllForUser(req.user.userId);
  }

  @Get(":id")
  @ApiOperation({ summary: "Get character by ID" })
  @ApiResponse({ status: 200, description: "Character retrieved successfully" })
  @ApiResponse({ status: 404, description: "Character not found" })
  findOne(@Request() req: any, @Param("id") id: string) {
    return this.characterService.findOneForUser(req.user.userId, id);
  }

  @Patch(":id")
  @ApiOperation({ summary: "Update character" })
  @ApiResponse({ status: 200, description: "Character updated successfully" })
  @ApiResponse({ status: 404, description: "Character not found" })
  update(
    @Request() req: any,
    @Param("id") id: string,
    @Body() dto: UpdateCharacterDto
  ) {
    return this.characterService.update(req.user.userId, id, dto);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Delete character" })
  @ApiResponse({ status: 200, description: "Character deleted successfully" })
  @ApiResponse({ status: 404, description: "Character not found" })
  remove(@Request() req: any, @Param("id") id: string) {
    return this.characterService.remove(req.user.userId, id);
  }
}
