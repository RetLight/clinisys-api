// src/modules/m2-purchases/solicitudes/dto/create-solicitud.dto.ts
import { IsArray, IsUUID, IsString, IsInt, Min } from 'class-validator';

export class SolicitudItemDto {
  @IsUUID()
  insumoId: string;

  @IsInt()
  @Min(1)
  cantidad: number;
}

export class CreateSolicitudDto {
  @IsUUID()
  creadoPor: string; // usuario_id

  @IsString()
  area: string;

  @IsArray()
  items: SolicitudItemDto[];
}
