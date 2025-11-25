// src/modules/m2-purchases/solicitudes/controllers/solicitudes.controller.ts
import { Controller, Post, Get, Param, Body } from '@nestjs/common';
import { SolicitudesService } from '../services/solicitudes.service';
import { CreateSolicitudDto } from '../dto/create-solicitud.dto';
import { AddItemSolicitudDto } from '../dto/add-item-solicitud.dto';

@Controller('solicitudes-compra')
export class SolicitudesController {
  constructor(private readonly service: SolicitudesService) {}

  @Post()
  create(@Body() dto: CreateSolicitudDto) {
    return this.service.create(dto);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Post(':id/items')
  addItem(@Param('id') id: string, @Body() dto: AddItemSolicitudDto) {
    return this.service.addItem(id, dto);
  }
}
