import { Controller, Post, Body } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { RegisterDto, LoginDto } from "./dto";
import { ApiTags } from "@nestjs/swagger";

@ApiTags("Auth")
@Controller("auth")
export class AuthController {
  constructor(private readonly svc: AuthService) {}

  @Post("register")
  async register(@Body() dto: RegisterDto) {
    return this.svc.register(dto.email, dto.password, dto.displayName);
  }

  @Post("login")
  async login(@Body() dto: LoginDto) {
    return this.svc.login(dto.email, dto.password);
  }
}
