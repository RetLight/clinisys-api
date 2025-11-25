import { Controller, Post, Body, Get, Param, Patch, Delete } from '@nestjs/common';
import { CitasService } from '../services/citas.service';
import { CreateCitaDto } from '../dto/create-cita.dto';
import { UpdateCitaDto } from '../dto/update-cita.dto';

@Controller('citas')
export class CitasController {
  constructor(private readonly service: CitasService) {}

  @Post()
  create(@Body() dto: CreateCitaDto) {
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
  update(@Param('id') id: string, @Body() dto: UpdateCitaDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
