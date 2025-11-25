// src/modules/m2-purchases/recepciones/services/recepciones.service.ts
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from 'src/shared/infrastructure/prisma/prisma.service';
import { CreateRecepcionDto } from '../dto/create-recepcion.dto';

@Injectable()
export class RecepcionesService {
  constructor(private prisma: PrismaService) {}

  async crearRecepcion(dto: CreateRecepcionDto) {
    if (!dto.detalles || dto.detalles.length === 0) {
      throw new BadRequestException(
        'La recepción debe incluir al menos un detalle.',
      );
    }

    const orden = await this.prisma.ordenCompra.findUnique({
      where: { id: dto.ordenId },
      include: {
        items: true,
      },
    });

    if (!orden) {
      throw new NotFoundException('Orden de compra no encontrada');
    }

    if (!orden.items || orden.items.length === 0) {
      throw new BadRequestException(
        'La orden de compra no tiene ítems configurados.',
      );
    }

    // Validar que todos los insumos pertenecen a la OC
    const mapaItemsOC = new Map<string, { cantidad: number }>();
    for (const item of orden.items) {
      mapaItemsOC.set(item.insumo_id, { cantidad: item.cantidad });
    }

    for (const det of dto.detalles) {
      if (!mapaItemsOC.has(det.insumoId)) {
        throw new BadRequestException(
          `El insumo ${det.insumoId} no pertenece a esta orden de compra.`,
        );
      }
    }

    // Transacción: Recepción + Detalles + MovimientoInsumo + stock
    return this.prisma.$transaction(async (tx) => {
      // Crear cabecera de recepción
      const recepcion = await tx.recepcion.create({
        data: {
          orden_id: dto.ordenId,
          fecha: new Date(),
          responsable: dto.responsableId,
        },
      });

      // Obtener recepciones previas de esta OC para validar cantidad total
      const recepcionesPrevias = await tx.recepcion.findMany({
        where: { orden_id: dto.ordenId },
        include: { detalles: true },
      });

      // Mapa de cantidad ya recibida por insumo
      const recibidasPorInsumo = new Map<string, number>();
      for (const rec of recepcionesPrevias) {
        for (const det of rec.detalles) {
          const actual = recibidasPorInsumo.get(det.insumo_id) ?? 0;
          recibidasPorInsumo.set(det.insumo_id, actual + det.cantidad_recibida);
        }
      }

      // Crear detalles y actualizar stock
      for (const det of dto.detalles) {
        const itemOC = mapaItemsOC.get(det.insumoId)!;
        const yaRecibido = recibidasPorInsumo.get(det.insumoId) ?? 0;
        const totalTrasEstaRecepcion = yaRecibido + det.cantidadRecibida;

        if (totalTrasEstaRecepcion > itemOC.cantidad) {
          throw new BadRequestException(
            `La cantidad total recibida para el insumo ${det.insumoId} ` +
              `(${totalTrasEstaRecepcion}) excede la cantidad de la OC (${itemOC.cantidad}).`,
          );
        }

        // Crear detalle de recepción
        await tx.recepcionDetalle.create({
          data: {
            recepcion_id: recepcion.id,
            insumo_id: det.insumoId,
            cantidad_recibida: det.cantidadRecibida,
          },
        });

        // Movimiento de inventario (entrada)
        await tx.movimientoInsumo.create({
          data: {
            insumo_id: det.insumoId,
            tipo: 'entrada',
            cantidad: det.cantidadRecibida,
            origen: `COMPRA:OC-${dto.ordenId}`,
            fecha: new Date(),
          },
        });

        // Actualizar stock_actual de Insumo
        await tx.insumo.update({
          where: { id: det.insumoId },
          data: {
            stock_actual: {
              increment: det.cantidadRecibida,
            },
          },
        });
      }

      // Ajustar estado de la OC si corresponde
      const recepcionesActualizadas = await tx.recepcion.findMany({
        where: { orden_id: dto.ordenId },
        include: { detalles: true },
      });

      const totalRecibidoPorInsumo = new Map<string, number>();
      for (const rec of recepcionesActualizadas) {
        for (const det of rec.detalles) {
          const actual = totalRecibidoPorInsumo.get(det.insumo_id) ?? 0;
          totalRecibidoPorInsumo.set(
            det.insumo_id,
            actual + det.cantidad_recibida,
          );
        }
      }

      let completamenteRecibida = true;
      for (const item of orden.items) {
        const totalRecibido = totalRecibidoPorInsumo.get(item.insumo_id) ?? 0;
        if (totalRecibido < item.cantidad) {
          completamenteRecibida = false;
          break;
        }
      }

      await tx.ordenCompra.update({
        where: { id: dto.ordenId },
        data: {
          estado: completamenteRecibida ? 'RECIBIDA' : 'PARCIAL',
        },
      });

      return recepcion;
    });
  }

  findByOrden(ordenId: string) {
    return this.prisma.recepcion.findMany({
      where: { orden_id: ordenId },
      include: {
        detalles: {
          include: {
            insumo: true,
          },
        },
      },
    });
  }
}
