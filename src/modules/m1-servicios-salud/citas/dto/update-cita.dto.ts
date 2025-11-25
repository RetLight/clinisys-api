import { PartialType } from '@nestjs/mapped-types';
import { CreateCitaDto } from './create-cita.dto';
import { IsOptional, IsString, IsDateString, IsUUID } from 'class-validator';

export class UpdateCitaDto extends PartialType(CreateCitaDto) {
  @IsOptional()
  @IsString()
  estado?: string;

  @IsOptional()
  @IsDateString()
  fecha?: string;

  @IsOptional()
  @IsString()
  motivo?: string;

  @IsOptional()
  @IsUUID()
  pacienteId?: string;

  @IsOptional()
  @IsUUID()
  medicoId?: string;
}
