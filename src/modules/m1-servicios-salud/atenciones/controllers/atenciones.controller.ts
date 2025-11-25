import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';
import { AtencionesService } from '../services/atenciones.service';
import { CreateAtencionDto } from '../dto/create-atencion.dto';
import { UpdateAtencionDto } from '../dto/update-atencion.dto';

@Controller('atenciones')
export class AtencionesController {
  constructor(private readonly service: AtencionesService) {}

  @Post()
  create(@Body() dto: CreateAtencionDto) {
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
  update(@Param('id') id: string, @Body() dto: UpdateAtencionDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
