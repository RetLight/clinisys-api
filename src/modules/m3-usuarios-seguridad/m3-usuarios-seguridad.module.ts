import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { AuthController } from './presentation/controllers/auth.controller';

import { AuthAppService } from './application/services/auth-app.service';

import { UsuarioRepositoryPg } from './infrastructure/repositories/usuario.repository.pg';
import { PasswordHashDomainService } from '../../shared/domain/services/password-hash.domain-service';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: (process.env.JWT_EXPIRES_IN || '1h') as any },
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthAppService,
    UsuarioRepositoryPg,
    PasswordHashDomainService,
    {
      provide: 'UsuarioRepository',
      useExisting: UsuarioRepositoryPg,
    },
  ],
  exports: [AuthAppService],
})
export class M3UsuariosSeguridadModule {}
