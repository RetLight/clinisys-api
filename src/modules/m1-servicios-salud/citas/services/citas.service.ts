import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/shared/infrastructure/prisma/prisma.service';
import { CreateCitaDto } from '../dto/create-cita.dto';
import { UpdateCitaDto } from '../dto/update-cita.dto';
import { CitaRules } from '../validators/cita.rules';

@Injectable()
export class CitasService {
  constructor(private prisma: PrismaService) {}

  // -----------------------------
  // VALIDACIONES SEMÁNTICAS
  // -----------------------------

  private ensureFechaFutura(fecha: Date) {
    const now = new Date();
    if (fecha.getTime() <= now.getTime()) {
      throw new BadRequestException('La fecha debe ser futura.');
    }
  }

  private ensureHorarioClinica(fecha: Date) {
    if (!CitaRules.horaValida(fecha)) {
      throw new BadRequestException(
        'Horario inválido. Citas solo entre 08:00 y 20:00.',
      );
    }
  }

  private async ensurePacienteYMedicoExisten(pacienteId: string, medicoId: string) {
    const paciente = await this.prisma.paciente.findUnique({ where: { id: pacienteId } });
    if (!paciente) throw new NotFoundException('Paciente no encontrado.');

    const medico = await this.prisma.medico.findUnique({ where: { id: medicoId } });
    if (!medico) throw new NotFoundException('Medico no encontrado.');
  }

  private async ensureDisponibilidad(medicoId: string, pacienteId: string, fecha: Date, ignoreId?: string) {
    const conflictoMedico = await this.prisma.cita.findFirst({
      where: {
        medico_id: medicoId,
        fecha,
        ...(ignoreId && { NOT: { id: ignoreId } }),
      },
    });

    if (conflictoMedico) throw new ConflictException('El médico ya tiene una cita en ese horario.');

    const conflictoPaciente = await this.prisma.cita.findFirst({
      where: {
        paciente_id: pacienteId,
        fecha,
        ...(ignoreId && { NOT: { id: ignoreId } }),
      },
    });

    if (conflictoPaciente)
      throw new ConflictException('El paciente ya tiene una cita en ese horario.');
  }

  // -----------------------------
  // CRUD
  // -----------------------------

  async create(dto: CreateCitaDto) {
    const fecha = new Date(dto.fecha);

    this.ensureFechaFutura(fecha);
    this.ensureHorarioClinica(fecha);
    await this.ensurePacienteYMedicoExisten(dto.pacienteId, dto.medicoId);
    await this.ensureDisponibilidad(dto.medicoId, dto.pacienteId, fecha);

    return this.prisma.cita.create({
      data: {
        fecha,
        motivo: dto.motivo,
        estado: 'pendiente',
        paciente_id: dto.pacienteId,
        medico_id: dto.medicoId,
      },
      include: { paciente: true, medico: true },
    });
  }

  async findAll() {
    return this.prisma.cita.findMany({
      include: { paciente: true, medico: true },
      orderBy: { fecha: 'asc' },
    });
  }

  async findOne(id: string) {
    const cita = await this.prisma.cita.findUnique({
      where: { id },
      include: { paciente: true, medico: true },
    });

    if (!cita) throw new NotFoundException('Cita no encontrada.');
    return cita;
  }

  async update(id: string, dto: UpdateCitaDto) {
    const existing = await this.prisma.cita.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Cita no encontrada.');

    const fecha = dto.fecha ? new Date(dto.fecha) : existing.fecha;
    const paciente = dto.pacienteId ?? existing.paciente_id;
    const medico = dto.medicoId ?? existing.medico_id;

    this.ensureFechaFutura(fecha);
    this.ensureHorarioClinica(fecha);
    await this.ensurePacienteYMedicoExisten(paciente, medico);
    await this.ensureDisponibilidad(medico, paciente, fecha, id);

    return this.prisma.cita.update({
      where: { id },
      data: {
        fecha,
        motivo: dto.motivo ?? existing.motivo,
        estado: dto.estado ?? existing.estado,
        paciente_id: paciente,
        medico_id: medico,
      },
      include: { paciente: true, medico: true },
    });
  }

  async remove(id: string) {
    const cita = await this.prisma.cita.findUnique({ where: { id } });
    if (!cita) throw new NotFoundException('Cita no encontrada.');

    await this.prisma.cita.delete({ where: { id } });
    return { message: 'Cita eliminada correctamente.' };
  }
}
