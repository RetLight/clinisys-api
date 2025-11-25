// src/modules/m2-purchases/conciliacion/dto/conciliar-orden.dto.ts
import { IsUUID, IsArray, IsNumber, IsInt, Min } from 'class-validator';

export class LineaFacturaDto {
  @IsUUID()
  insumoId: string;

  @IsInt()
  @Min(0)
  cantidadFacturada: number;

  @IsNumber()
  precioUnitario: number;
}

export class ConciliarOrdenDto {
  @IsUUID()
  ordenId: string;

  @IsArray()
  lineasFactura: LineaFacturaDto[];
}
