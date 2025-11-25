// src/modules/m2-purchases/recepciones/controllers/recepciones.controller.ts
import { Controller, Post, Get, Param, Body } from '@nestjs/common';
import { RecepcionesService } from '../services/recepciones.service';
import { CreateRecepcionDto } from '../dto/create-recepcion.dto';

@Controller('recepciones')
export class RecepcionesController {
  constructor(private readonly service: RecepcionesService) {}

  @Post()
  crear(@Body() dto: CreateRecepcionDto) {
    return this.service.crearRecepcion(dto);
  }

  @Get('orden/:ordenId')
  findByOrden(@Param('ordenId') ordenId: string) {
    return this.service.findByOrden(ordenId);
  }
}
