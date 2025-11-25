// src/modules/m2-purchases/m2-purchases.module.ts
import { Module } from '@nestjs/common';
import { PrismaService } from 'src/shared/infrastructure/prisma/prisma.service';

// Proveedores
import { ProveedoresController } from './proveedores/controllers/proveedores.controller';
import { ProveedoresService } from './proveedores/services/proveedores.service';

// Solicitudes
import { SolicitudesController } from './solicitudes/controllers/solicitudes.controller';
import { SolicitudesService } from './solicitudes/services/solicitudes.service';

// Órdenes
import { OrdenesController } from './ordenes/controllers/ordenes.controller';
import { OrdenesService } from './ordenes/services/ordenes.service';

// Recepciones
import { RecepcionesController } from './recepciones/controllers/recepciones.controller';
import { RecepcionesService } from './recepciones/services/recepciones.service';

// Conciliación
import { ConciliacionController } from './conciliacion/controllers/conciliacion.controller';
import { ConciliacionService } from './conciliacion/services/conciliacion.service';

@Module({
  controllers: [
    ProveedoresController,
    SolicitudesController,
    OrdenesController,
    RecepcionesController,
    ConciliacionController,
  ],
  providers: [
    PrismaService,
    ProveedoresService,
    SolicitudesService,
    OrdenesService,
    RecepcionesService,
    ConciliacionService,
  ],
  exports: [
    ProveedoresService,
    SolicitudesService,
    OrdenesService,
    RecepcionesService,
    ConciliacionService,
  ],
})
export class M2PurchasesModule {}
