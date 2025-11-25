import { IsUUID, IsString, IsDateString, Length } from 'class-validator';

export class CreateCitaDto {
  @IsDateString()
  fecha: string;

  @IsString()
  @Length(3, 200)
  motivo: string;

  @IsUUID()
  pacienteId: string;

  @IsUUID()
  medicoId: string;
}
