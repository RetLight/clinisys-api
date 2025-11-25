// src/modules/m2-purchases/recepciones/dto/create-recepcion.dto.ts
import { IsUUID, IsArray, IsInt, Min } from 'class-validator';

export class RecepcionDetalleDto {
  @IsUUID()
  insumoId: string;

  @IsInt()
  @Min(1)
  cantidadRecibida: number;
}

export class CreateRecepcionDto {
  @IsUUID()
  ordenId: string;

  @IsUUID()
  responsableId: string; // Usuario.id

  @IsArray()
  detalles: RecepcionDetalleDto[];
}
