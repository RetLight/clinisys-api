import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  Patch,
  Delete,
} from '@nestjs/common';
import { ProcedimientosService } from '../services/procedimientos.service';
import { CreateProcedimientoDto } from '../dto/create-procedimiento.dto';
import { UpdateProcedimientoDto } from '../dto/update-procedimiento.dto';

@Controller('procedimientos')
export class ProcedimientosController {
  constructor(private readonly service: ProcedimientosService) {}

  @Post()
  create(@Body() dto: CreateProcedimientoDto) {
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

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateProcedimientoDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
