// src/modules/m2-purchases/ordenes/services/ordenes.service.ts
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from 'src/shared/infrastructure/prisma/prisma.service';
import { GenerarDesdeSolicitudDto } from '../dto/generar-desde-solicitud.dto';

@Injectable()
export class OrdenesService {
  constructor(private prisma: PrismaService) {}

  async generarDesdeSolicitud(dto: GenerarDesdeSolicitudDto) {
    const solicitud = await this.prisma.solicitudCompra.findUnique({
      where: { id: dto.solicitudId },
      include: {
        items: true,
      },
    });

    if (!solicitud) {
      throw new NotFoundException('Solicitud de compra no encontrada');
    }

    if (!solicitud.items || solicitud.items.length === 0) {
      throw new BadRequestException('La solicitud no tiene ítems');
    }

    const proveedor = await this.prisma.proveedor.findUnique({
      where: { id: dto.proveedorId },
    });

    if (!proveedor) {
      throw new NotFoundException('Proveedor no encontrado');
    }

    // Táctica: transacción para OC + items y actualizar estado SC
    return this.prisma.$transaction(async (tx) => {
      // Crear OC
      const orden = await tx.ordenCompra.create({
        data: {
          proveedor_id: dto.proveedorId,
          solicitud_id: dto.solicitudId,
          fecha: new Date(),
          estado: 'EMITIDA',
        },
      });

      // Crear items de OC en base a SC
      for (const item of solicitud.items) {
        await tx.ordenCompraItem.create({
          data: {
            orden_id: orden.id,
            insumo_id: item.insumo_id,
            cantidad: item.cantidad,
            precio_unitario: 0, // se puede actualizar luego
          },
        });
      }

      // Actualizar estado de la solicitud
      await tx.solicitudCompra.update({
        where: { id: dto.solicitudId },
        data: {
          estado: 'CONVERTIDA_OC',
        },
      });

      return orden;
    });
  }

  findAll() {
    return this.prisma.ordenCompra.findMany({
      include: {
        proveedor: true,
        solicitud: true,
        items: {
          include: {
            insumo: true,
          },
        },
      },
    });
  }

  async findOne(id: string) {
    const orden = await this.prisma.ordenCompra.findUnique({
      where: { id },
      include: {
        proveedor: true,
        solicitud: true,
        items: {
          include: {
            insumo: true,
          },
        },
      },
    });

    if (!orden) {
      throw new NotFoundException('Orden de compra no encontrada');
    }

    return orden;
  }
}
