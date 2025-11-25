// src/modules/m2-purchases/conciliacion/services/conciliacion.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/shared/infrastructure/prisma/prisma.service';
import { ConciliarOrdenDto } from '../dto/conciliar-orden.dto';

@Injectable()
export class ConciliacionService {
  constructor(private prisma: PrismaService) {}

  async conciliarOrden(dto: ConciliarOrdenDto) {
    const orden = await this.prisma.ordenCompra.findUnique({
      where: { id: dto.ordenId },
      include: {
        items: true,
        recepciones: {
          include: {
            detalles: true,
          },
        },
      },
    });

    if (!orden) {
      throw new NotFoundException('Orden de compra no encontrada');
    }

    // Mapas para datos base
    const mapaItemsOC = new Map<
      string,
      { cantidadOC: number; precioOC: number }
    >();
    for (const item of orden.items) {
      mapaItemsOC.set(item.insumo_id, {
        cantidadOC: item.cantidad,
        precioOC: Number(item.precio_unitario ?? 0),
      });
    }

    // Cantidad recibida por insumo
    const mapaRecibido = new Map<string, number>();
    for (const rec of orden.recepciones ?? []) {
      for (const det of rec.detalles) {
        const actual = mapaRecibido.get(det.insumo_id) ?? 0;
        mapaRecibido.set(det.insumo_id, actual + det.cantidad_recibida);
      }
    }

    // Factura (viene por DTO)
    const mapaFactura = new Map<
      string,
      { cantidadFacturada: number; precioUnitario: number }
    >();
    for (const linea of dto.lineasFactura) {
      mapaFactura.set(linea.insumoId, {
        cantidadFacturada: linea.cantidadFacturada,
        precioUnitario: linea.precioUnitario,
      });
    }

    // Tolerancias (ejemplo)
    const TOL_CANTIDAD = 0.05; // 5%
    const TOL_PRECIO = 0.1; // 10%

    const resultadoPorInsumo: any[] = [];
    let todasLineasOk = true;

    for (const [insumoId, baseOC] of mapaItemsOC.entries()) {
      const recibido = mapaRecibido.get(insumoId) ?? 0;
      const factura = mapaFactura.get(insumoId);

      const facturada = factura?.cantidadFacturada ?? 0;
      const precioFact = factura?.precioUnitario ?? 0;

      const difCantidad = facturada - recibido;
      const difPrecio = precioFact - baseOC.precioOC;

      const limiteDifCantidad = baseOC.cantidadOC * TOL_CANTIDAD;
      const limiteDifPrecio = baseOC.precioOC * TOL_PRECIO;

      const cantidadOk = Math.abs(difCantidad) <= limiteDifCantidad;
      const precioOk =
        baseOC.precioOC === 0 ? true : Math.abs(difPrecio) <= limiteDifPrecio;

      const lineaOk = cantidadOk && precioOk;

      if (!lineaOk) {
        todasLineasOk = false;
      }

      resultadoPorInsumo.push({
        insumoId,
        cantidadOC: baseOC.cantidadOC,
        cantidadRecibida: recibido,
        cantidadFacturada: facturada,
        precioOC: baseOC.precioOC,
        precioFacturado: precioFact,
        cantidadOk,
        precioOk,
        lineaOk,
      });
    }

    // Actualizar estado de la OC según resultado de conciliación
    await this.prisma.ordenCompra.update({
      where: { id: dto.ordenId },
      data: {
        estado: todasLineasOk ? 'CONCILIADA' : 'OBSERVADA',
      },
    });

    return {
      ordenId: dto.ordenId,
      estado: todasLineasOk ? 'CONCILIADA' : 'OBSERVADA',
      resumen: resultadoPorInsumo,
    };
  }
}
