import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from 'src/shared/infrastructure/prisma/prisma.service';
import { CreateProcedimientoDto } from '../dto/create-procedimiento.dto';
import { UpdateProcedimientoDto } from '../dto/update-procedimiento.dto';
import { ProcedimientosRules } from '../validators/procedimientos.rules';

@Injectable()
export class ProcedimientosService {
  constructor(private prisma: PrismaService) {}

  // ---------------------------------------
  // VALIDACIONES PREVIAS
  // ---------------------------------------

  private async ensureAtencionExiste(atencionId: string) {
    const atencion = await this.prisma.atencionMedica.findUnique({
      where: { id: atencionId },
      include: { cita: true },
    });

    if (!atencion) {
      throw new NotFoundException('La atención médica no existe.');
    }

    return atencion;
  }

  private async ensureInsumoExiste(insumoId: string) {
    const insumo = await this.prisma.insumo.findUnique({
      where: { id: insumoId },
    });

    if (!insumo) {
      throw new NotFoundException('El insumo no existe.');
    }

    return insumo;
  }

  // ---------------------------------------
  // CRUD + INTEGRACIÓN CON INVENTARIO
  // ---------------------------------------

  async create(dto: CreateProcedimientoDto) {
    const atencion = await this.ensureAtencionExiste(dto.atencionId);
    const insumo = await this.ensureInsumoExiste(dto.insumoId);

    if (
      !ProcedimientosRules.validarStockDisponible(
        insumo.stock_actual,
        dto.cantidad,
      )
    ) {
      throw new BadRequestException(
        'Stock insuficiente para registrar el procedimiento.',
      );
    }

    // Transacción: registrar procedimiento + movimiento + consumo
    return this.prisma.$transaction(async (tx) => {
      // 1. Registrar el procedimiento
      const procedimiento = await tx.procedimiento.create({
        data: {
          atencion_id: dto.atencionId,
          descripcion: dto.descripcion,
          cantidad: dto.cantidad,
          insumo_id: dto.insumoId,
        },
      });

      // 2. Registrar movimiento de inventario (salida)
      await tx.movimientoInsumo.create({
        data: {
          insumo_id: dto.insumoId,
          tipo: 'salida',
          cantidad: dto.cantidad,
          origen: 'procedimiento',
          fecha: new Date(),
        },
      });

      // 3. Actualizar stock
      await tx.insumo.update({
        where: { id: dto.insumoId },
        data: {
          stock_actual: insumo.stock_actual - dto.cantidad,
        },
      });

      // 4. Registrar consumo por paciente
      await tx.consumoPaciente.create({
        data: {
          paciente_id: atencion.cita.paciente_id,
          insumo_id: dto.insumoId,
          cantidad: dto.cantidad,
          atencion_id: dto.atencionId,
          fecha: new Date(),
        },
      });

      return procedimiento;
    });
  }

  async findAll() {
    return this.prisma.procedimiento.findMany({
      include: {
        insumo: true,
        atencion: {
          include: {
            cita: true,
          },
        },
      },
    });
  }

  async findOne(id: string) {
    const procedimiento = await this.prisma.procedimiento.findUnique({
      where: { id },
      include: {
        insumo: true,
        atencion: {
          include: {
            cita: {
              include: {
                paciente: true,
                medico: true,
              },
            },
          },
        },
      },
    });

    if (!procedimiento) {
      throw new NotFoundException('Procedimiento no encontrado.');
    }

    return procedimiento;
  }

  async update(id: string, dto: UpdateProcedimientoDto) {
    return this.prisma.procedimiento.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: string) {
    const procedimiento = await this.prisma.procedimiento.findUnique({
      where: { id },
    });

    if (!procedimiento) {
      throw new NotFoundException('Procedimiento no encontrado.');
    }

    // Nota: no reponemos stock automáticamente a menos que tú lo definas.
    await this.prisma.procedimiento.delete({ where: { id } });

    return { message: 'Procedimiento eliminado correctamente.' };
  }
}
