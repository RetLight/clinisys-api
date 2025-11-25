import { Injectable } from '@nestjs/common';
import type { UsuarioRepository } from '../../../../shared/domain/repositories/usuario.repository';
import { Usuario } from '../../../../shared/domain/entities/usuario.entity';
import { PrismaService } from 'src/shared/infrastructure/prisma/prisma.service';

@Injectable()
export class UsuarioRepositoryPg implements UsuarioRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByEmail(email: string): Promise<Usuario | null> {
    const row = await this.prisma.usuario.findUnique({ where: { email } });
    if (!row) return null;
    return new Usuario(
      row.id,
      row.nombre,
      row.email,
      row.password_hash,
      row.activo,
    );
  }

  async findById(id: string): Promise<Usuario | null> {
    const row = await this.prisma.usuario.findUnique({ where: { id } });
    if (!row) return null;
    return new Usuario(
      row.id,
      row.nombre,
      row.email,
      row.password_hash,
      row.activo,
    );
  }

  async save(usuario: Usuario): Promise<void> {
    await this.prisma.usuario.upsert({
      where: { id: usuario.id },
      create: {
        id: usuario.id,
        nombre: usuario.nombre,
        email: usuario.email,
        password_hash: usuario.passwordHash,
        activo: usuario.activo,
        created_at: new Date(),
      },
      update: {
        nombre: usuario.nombre,
        email: usuario.email,
        password_hash: usuario.passwordHash,
        activo: usuario.activo,
      },
    });
  }
}
