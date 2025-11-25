import { IsUUID, IsString, IsInt, Min } from 'class-validator';

export class CreateProcedimientoDto {
  @IsUUID()
  atencionId: string;

  @IsString()
  descripcion: string;

  @IsUUID()
  insumoId: string;

  @IsInt()
  @Min(1)
  cantidad: number;
}
