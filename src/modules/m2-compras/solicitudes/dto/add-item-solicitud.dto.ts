// src/modules/m2-purchases/solicitudes/dto/add-item-solicitud.dto.ts
import { IsUUID, IsInt, Min } from 'class-validator';

export class AddItemSolicitudDto {
  @IsUUID()
  insumoId: string;

  @IsInt()
  @Min(1)
  cantidad: number;
}
