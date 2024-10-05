import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { VentaService } from './venta.service';
import { CreateVentaDto } from './dto/create-venta.dto';
import { UpdateVentaDto } from './dto/update-venta.dto';
import { ApiTags } from '@nestjs/swagger';

import { Auth } from 'src/auth/decorators/auth.decorator';
import { Roles } from 'src/common/enums/roles.enum';
import { ActiveUser } from 'src/common/decorators/user.decorator';
import { User_Interface } from 'src/common/interfaces/user.interface';

@Auth(Roles.ADMIN)
@Auth(Roles.RF)
@Auth(Roles.SECRE)
@ApiTags('venta_controller')
@Controller('venta')
export class VentaController {
  constructor(private readonly ventaService: VentaService) {}

  @Post()
  create(@Body() createVentaDto: CreateVentaDto, @ActiveUser() user: User_Interface) {
    return this.ventaService.create(createVentaDto, user);
  }

  @Get()
  findAll() {
    return this.ventaService.findAll();
  }

  @Get('obtenerVentas/')
  obtenerVentas() {
    return this.ventaService.obtenerVentas();
  }

  @Get(':id')
  findOne(@Param('id') id: string ) {
    return this.ventaService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateVentaDto: UpdateVentaDto, @ActiveUser() user: User_Interface) {
    return this.ventaService.update(+id, updateVentaDto, user);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @ActiveUser() user: User_Interface) {
    return this.ventaService.remove(+id, user);
  }
}
