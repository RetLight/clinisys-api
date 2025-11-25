// src/modules/m1-health/m1-health.module.ts
import { Module } from '@nestjs/common';
import { PrismaService } from 'src/shared/infrastructure/prisma/prisma.service';

// Citas
import { CitasController } from './citas/controllers/cita.controller';
import { CitasService } from './citas/services/citas.service';

// Atenciones
import { AtencionesController } from './atenciones/controllers/atenciones.controller';
import { AtencionesService } from './atenciones/services/atenciones.service';

// Procedimientos
import { ProcedimientosController } from './procedimientos/controllers/procedimientos.controller';
import { ProcedimientosService } from './procedimientos/services/procedimientos.service';

@Module({
  controllers: [
    CitasController,
    AtencionesController,
    ProcedimientosController,
  ],
  providers: [
    PrismaService, // compartido en todo M1
    CitasService,
    AtencionesService,
    ProcedimientosService,
  ],
  exports: [CitasService, AtencionesService, ProcedimientosService],
})
export class M1HealthModule {}
