// src/modules/m2-purchases/ordenes/controllers/ordenes.controller.ts
import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import { OrdenesService } from '../services/ordenes.service';
import { GenerarDesdeSolicitudDto } from '../dto/generar-desde-solicitud.dto';

@Controller('ordenes-compra')
export class OrdenesController {
  constructor(private readonly service: OrdenesService) {}

  @Post('generar-desde-solicitud')
  generarDesdeSolicitud(@Body() dto: GenerarDesdeSolicitudDto) {
    return this.service.generarDesdeSolicitud(dto);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }
}
