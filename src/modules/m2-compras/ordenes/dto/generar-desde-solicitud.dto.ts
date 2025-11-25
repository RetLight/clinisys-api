// src/modules/m2-purchases/ordenes/dto/generar-desde-solicitud.dto.ts
import { IsUUID } from 'class-validator';

export class GenerarDesdeSolicitudDto {
  @IsUUID()
  solicitudId: string;

  @IsUUID()
  proveedorId: string;
}
