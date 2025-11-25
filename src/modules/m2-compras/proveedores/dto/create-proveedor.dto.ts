// src/modules/m2-purchases/proveedores/dto/create-proveedor.dto.ts
import { IsString } from 'class-validator';

export class CreateProveedorDto {
  @IsString()
  nombre: string;

  @IsString()
  ruc: string;

  @IsString()
  telefono: string;

  @IsString()
  direccion: string;
}
