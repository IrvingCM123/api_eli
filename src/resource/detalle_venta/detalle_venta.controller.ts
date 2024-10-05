import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { DetalleVentaService } from './detalle_venta.service';
import { CreateDetalleVentaDto } from './dto/create-detalle_venta.dto';
import { UpdateDetalleVentaDto } from './dto/update-detalle_venta.dto';

import { ApiTags } from '@nestjs/swagger';

@ApiTags('detalle_venta_controller')
@Controller('detalle-venta')
export class DetalleVentaController {
  constructor(private readonly detalleVentaService: DetalleVentaService) {}

  @Post()
  create(@Body() createDetalleVentaDto: CreateDetalleVentaDto) {
    return this.detalleVentaService.create(createDetalleVentaDto);
  }

  @Get()
  findAll() {
    return this.detalleVentaService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.detalleVentaService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDetalleVentaDto: UpdateDetalleVentaDto) {
    return this.detalleVentaService.update(+id, updateDetalleVentaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.detalleVentaService.remove(+id);
  }
}