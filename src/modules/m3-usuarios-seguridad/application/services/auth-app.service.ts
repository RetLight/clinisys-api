import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import type { UsuarioRepository } from '../../../../shared/domain/repositories/usuario.repository';
import { PasswordHashDomainService } from '../../../../shared/domain/services/password-hash.domain-service';

@Injectable()
export class AuthAppService {
  constructor(
    @Inject('UsuarioRepository')
    private readonly usuarioRepo: UsuarioRepository,
    private readonly passwordService: PasswordHashDomainService,
    private readonly jwtService: JwtService,
  ) {}

  async login(email: string, plainPassword: string) {
    const usuario = await this.usuarioRepo.findByEmail(email);
    if (!usuario) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const ok = await this.passwordService.compare(
      plainPassword,
      usuario.passwordHash,
    );
    if (!ok) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const payload = { sub: usuario.id, email: usuario.email };
    const accessToken = await this.jwtService.signAsync(payload);

    return { accessToken };
  }
}
