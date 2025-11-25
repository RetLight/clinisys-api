import { PartialType } from '@nestjs/mapped-types';
import { CreateAtencionDto } from './create-atencion.dto';
import { IsOptional, IsDateString, IsString } from 'class-validator';

export class UpdateAtencionDto extends PartialType(CreateAtencionDto) {
  @IsOptional()
  @IsDateString()
  fecha?: string;

  @IsOptional()
  @IsString()
  diagnostico?: string;

  @IsOptional()
  observaciones?: any;
}
