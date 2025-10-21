import {
  Injectable,
  ConflictException,
  UnauthorizedException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "./entities";
import * as bcrypt from "bcrypt";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    private readonly jwtService: JwtService
  ) {}

  async register(email: string, password: string, displayName?: string) {
    const existing = await this.userRepo.findOne({ where: { email } });
    if (existing) throw new ConflictException("User already exists");
    const hash = await bcrypt.hash(password, 10);
    const u = this.userRepo.create({ email, passwordHash: hash, displayName });
    const saved = await this.userRepo.save(u);
    return this.signPayload({ sub: saved.id, email: saved.email });
  }

  async validateUser(email: string, pass: string) {
    const user = await this.userRepo.findOne({ where: { email } });
    if (!user) return null;
    const ok = await bcrypt.compare(pass, user.passwordHash);
    if (!ok) return null;
    return user;
  }

  signPayload(payload: any) {
    return { accessToken: this.jwtService.sign(payload) };
  }

  async login(email: string, pass: string) {
    const user = await this.validateUser(email, pass);
    if (!user) throw new UnauthorizedException("Invalid credentials");
    return this.signPayload({ sub: user.id, email: user.email });
  }
}
