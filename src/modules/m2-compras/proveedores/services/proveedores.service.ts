// src/modules/m2-purchases/proveedores/services/proveedores.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/shared/infrastructure/prisma/prisma.service';
import { CreateProveedorDto } from '../dto/create-proveedor.dto';
import { UpdateProveedorDto } from '../dto/update-proveedor.dto';

@Injectable()
export class ProveedoresService {
  constructor(private prisma: PrismaService) {}

  create(dto: CreateProveedorDto) {
    return this.prisma.proveedor.create({
      data: {
        nombre: dto.nombre,
        ruc: dto.ruc,
        telefono: dto.telefono,
        direccion: dto.direccion,
      },
    });
  }

  findAll() {
    return this.prisma.proveedor.findMany();
  }

  async findOne(id: string) {
    const proveedor = await this.prisma.proveedor.findUnique({
      where: { id },
    });
    if (!proveedor) {
      throw new NotFoundException('Proveedor no encontrado');
    }
    return proveedor;
  }

  async update(id: string, dto: UpdateProveedorDto) {
    await this.findOne(id);
    return this.prisma.proveedor.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.prisma.proveedor.delete({ where: { id } });
    return { message: 'Proveedor eliminado correctamente' };
  }
}
