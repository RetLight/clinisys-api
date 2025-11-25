import { IsUUID, IsString, IsOptional, IsDateString, MinLength } from 'class-validator';

export class CreateAtencionDto {
  @IsUUID()
  citaId: string;

  @IsOptional()
  @IsString()
  @MinLength(3)
  diagnostico?: string;

  @IsOptional()
  // Se recibe como JSON plano (cualquier estructura)
  observaciones?: any;

  @IsDateString()
  fecha: string;
}
