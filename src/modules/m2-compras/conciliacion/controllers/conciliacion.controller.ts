// src/modules/m2-purchases/conciliacion/controllers/conciliacion.controller.ts
import { Controller, Post, Body } from '@nestjs/common';
import { ConciliacionService } from '../services/conciliacion.service';
import { ConciliarOrdenDto } from '../dto/conciliar-orden.dto';

@Controller('conciliacion')
export class ConciliacionController {
  constructor(private readonly service: ConciliacionService) {}

  @Post('orden')
  conciliarOrden(@Body() dto: ConciliarOrdenDto) {
    return this.service.conciliarOrden(dto);
  }
}
