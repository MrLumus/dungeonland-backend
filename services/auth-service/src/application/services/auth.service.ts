import {
  Injectable,
  ConflictException,
  UnauthorizedException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "@domain/entities";
import * as bcrypt from "bcrypt";
import { JwtService } from "@nestjs/jwt";

/**
 * Auth Application Service
 * Handles authentication business logic
 */
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
    const user = this.userRepo.create({
      email,
      passwordHash: hash,
      displayName
    });

    const saved = await this.userRepo.save(user);
    return this.signPayload({ sub: saved.id, email: saved.email });
  }

  async validateUser(email: string, pass: string): Promise<User | null> {
    const user = await this.userRepo.findOne({ where: { email } });
    if (!user) return null;

    const isPasswordValid = await bcrypt.compare(pass, user.passwordHash);
    if (!isPasswordValid) return null;

    return user;
  }

  signPayload(payload: any) {
    return {
      accessToken: this.jwtService.sign(payload),
      userId: payload.sub
    };
  }

  async login(email: string, pass: string) {
    const user = await this.validateUser(email, pass);
    if (!user) throw new UnauthorizedException("Invalid credentials");

    return this.signPayload({ sub: user.id, email: user.email });
  }

  async getUserById(id: string): Promise<User | null> {
    return this.userRepo.findOne({ where: { id } });
  }
}
