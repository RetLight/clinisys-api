// src/modules/m2-purchases/solicitudes/services/solicitudes.service.ts
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from 'src/shared/infrastructure/prisma/prisma.service';
import { CreateSolicitudDto } from '../dto/create-solicitud.dto';
import { AddItemSolicitudDto } from '../dto/add-item-solicitud.dto';

@Injectable()
export class SolicitudesService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateSolicitudDto) {
    if (!dto.items || dto.items.length === 0) {
      throw new BadRequestException(
        'La solicitud debe tener al menos un ítem.',
      );
    }

    // Táctica: validación semántica + transacción
    return this.prisma.$transaction(async (tx) => {
      // Crear cabecera
      const solicitud = await tx.solicitudCompra.create({
        data: {
          fecha: new Date(),
          estado: 'PENDIENTE',
          creado_por: dto.creadoPor,
          area: dto.area,
        },
      });

      // Crear ítems
      for (const item of dto.items) {
        const insumo = await tx.insumo.findUnique({
          where: { id: item.insumoId },
        });
        if (!insumo) {
          throw new NotFoundException(
            `Insumo no encontrado para id: ${item.insumoId}`,
          );
        }

        await tx.solicitudCompraItem.create({
          data: {
            solicitud_id: solicitud.id,
            insumo_id: item.insumoId,
            cantidad: item.cantidad,
          },
        });
      }

      return solicitud;
    });
  }

  findAll() {
    return this.prisma.solicitudCompra.findMany({
      include: {
        items: {
          include: {
            insumo: true,
          },
        },
      },
    });
  }

  async findOne(id: string) {
    const solicitud = await this.prisma.solicitudCompra.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            insumo: true,
          },
        },
      },
    });

    if (!solicitud) {
      throw new NotFoundException('Solicitud de compra no encontrada');
    }

    return solicitud;
  }

  async addItem(solicitudId: string, dto: AddItemSolicitudDto) {
    const solicitud = await this.prisma.solicitudCompra.findUnique({
      where: { id: solicitudId },
    });

    if (!solicitud) {
      throw new NotFoundException('Solicitud de compra no encontrada');
    }

    const insumo = await this.prisma.insumo.findUnique({
      where: { id: dto.insumoId },
    });
    if (!insumo) {
      throw new NotFoundException('Insumo no encontrado');
    }

    return this.prisma.solicitudCompraItem.create({
      data: {
        solicitud_id: solicitudId,
        insumo_id: dto.insumoId,
        cantidad: dto.cantidad,
      },
    });
  }
}
