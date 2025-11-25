import {
  BadRequestException,
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from 'src/shared/infrastructure/prisma/prisma.service';
import { CreateAtencionDto } from '../dto/create-atencion.dto';
import { UpdateAtencionDto } from '../dto/update-atencion.dto';
import { AtencionRules } from '../validators/atencion.rules';

@Injectable()
export class AtencionesService {
  constructor(private prisma: PrismaService) {}

  // -----------------------------
  // VALIDACIONES SEMÁNTICAS
  // -----------------------------

  private async ensureCitaExiste(citaId: string) {
    const cita = await this.prisma.cita.findUnique({
      where: { id: citaId },
    });

    if (!cita) {
      throw new NotFoundException('La cita asociada no existe.');
    }

    return cita;
  }

  private async ensureAtencionUnicaPorCita(citaId: string) {
    const atencion = await this.prisma.atencionMedica.findFirst({
      where: { cita_id: citaId },
    });

    if (atencion) {
      throw new ConflictException(
        'Ya existe una atención registrada para esta cita.',
      );
    }
  }

  private ensureFechaValida(fechaAtencion: Date, fechaCita: Date) {
    if (!AtencionRules.fechaNoAntesDeCita(fechaCita, fechaAtencion)) {
      throw new BadRequestException(
        'La fecha de la atención no puede ser anterior a la fecha de la cita.',
      );
    }
  }

  // -----------------------------
  // CRUD
  // -----------------------------

  async create(dto: CreateAtencionDto) {
    const cita = await this.ensureCitaExiste(dto.citaId);
    await this.ensureAtencionUnicaPorCita(dto.citaId);

    const fechaAtencion = new Date(dto.fecha);
    this.ensureFechaValida(fechaAtencion, cita.fecha);

    // Crea atención y marca la cita como "atendida"
    const atencion = await this.prisma.atencionMedica.create({
      data: {
        cita_id: dto.citaId,
        diagnostico: dto.diagnostico ?? '',
        observaciones: dto.observaciones ?? {},
        fecha: fechaAtencion,
      },
      include: { cita: true },
    });

    await this.prisma.cita.update({
      where: { id: dto.citaId },
      data: { estado: 'atendida' },
    });

    return atencion;
  }

  async findAll() {
    return this.prisma.atencionMedica.findMany({
      include: {
        cita: {
          include: {
            paciente: true,
            medico: true,
          },
        },
      },
      orderBy: { fecha: 'desc' },
    });
  }

  async findOne(id: string) {
    const atencion = await this.prisma.atencionMedica.findUnique({
      where: { id },
      include: {
        cita: {
          include: {
            paciente: true,
            medico: true,
          },
        },
      },
    });

    if (!atencion) {
      throw new NotFoundException('Atención médica no encontrada.');
    }

    return atencion;
  }

  async update(id: string, dto: UpdateAtencionDto) {
    const atencion = await this.prisma.atencionMedica.findUnique({
      where: { id },
      include: { cita: true },
    });

    if (!atencion) {
      throw new NotFoundException('Atención médica no encontrada.');
    }

    const nuevaFecha =
      dto.fecha ? new Date(dto.fecha) : new Date(atencion.fecha);

    // Validar fecha respecto a la cita asociada
    this.ensureFechaValida(nuevaFecha, atencion.cita.fecha);

    return this.prisma.atencionMedica.update({
      where: { id },
      data: {
        fecha: nuevaFecha,
        diagnostico: dto.diagnostico ?? atencion.diagnostico,
        observaciones: dto.observaciones ?? atencion.observaciones,
      },
      include: {
        cita: {
          include: {
            paciente: true,
            medico: true,
          },
        },
      },
    });
  }

  async remove(id: string) {
    const atencion = await this.prisma.atencionMedica.findUnique({
      where: { id },
    });

    if (!atencion) {
      throw new NotFoundException('Atención médica no encontrada.');
    }

    // Opcional: al eliminar la atención, podrías devolver la cita a estado "confirmada"
    await this.prisma.cita.update({
      where: { id: atencion.cita_id },
      data: { estado: 'confirmada' },
    });

    await this.prisma.atencionMedica.delete({ where: { id } });

    return { message: 'Atención médica eliminada correctamente.' };
  }
}
