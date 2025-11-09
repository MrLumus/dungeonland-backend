import { Controller, Get } from "@nestjs/common";
import { ApiTags, ApiOperation } from "@nestjs/swagger";
import {
  EEquipmentTypes,
  EArmourTypes,
  EDamageTypes,
  EDiceTypes,
} from "../../domain/constants";

@ApiTags("References/Enums")
@Controller("enums")
export class EnumsController {
  @Get("equipment-types")
  @ApiOperation({ summary: "Get all equipment types" })
  getEquipmentTypes() {
    return Object.values(EEquipmentTypes).map((value) => ({
      value,
      label: value,
    }));
  }

  @Get("armour-types")
  @ApiOperation({ summary: "Get all armour types" })
  getArmourTypes() {
    return Object.values(EArmourTypes).map((value) => ({
      value,
      label: value,
    }));
  }

  @Get("damage-types")
  @ApiOperation({ summary: "Get all damage types" })
  getDamageTypes() {
    return Object.values(EDamageTypes).map((value) => ({
      value,
      label: value,
    }));
  }

  @Get("dice-types")
  @ApiOperation({ summary: "Get all dice types" })
  getDiceTypes() {
    return Object.values(EDiceTypes).map((value) => ({
      value,
      label: value,
    }));
  }
}
