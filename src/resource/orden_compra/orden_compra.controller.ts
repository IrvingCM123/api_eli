import { Controller, Get, Post, Body, Patch, Param, Delete, Put } from '@nestjs/common';
import { OrdenCompraService } from './orden_compra.service';
import { CreateOrdenCompraDto } from './dto/create-orden_compra.dto';
import { UpdateOrdenCompraDto } from './dto/update-orden_compra.dto';
import { ApiTags } from '@nestjs/swagger';

import { Auth } from 'src/auth/decorators/auth.decorator';
import { Roles } from 'src/common/enums/roles.enum';
import { ActiveUser } from 'src/common/decorators/user.decorator';
import { User_Interface } from 'src/common/interfaces/user.interface';

@Auth(Roles.ADMIN)
@Auth(Roles.RF)
@Auth(Roles.SECRE)
@ApiTags('orden_compra_controller')
@Controller('orden-compra')
export class OrdenCompraController {
  constructor(private readonly ordenCompraService: OrdenCompraService) {}

  @Post()
  create(@Body() createOrdenCompraDto: CreateOrdenCompraDto, @ActiveUser() user: User_Interface) {
    return this.ordenCompraService.create(createOrdenCompraDto, user);
  }

  @Post('/carritocompras')
  crear_varios(@Body() createOrdenCompraDto: CreateOrdenCompraDto[], @ActiveUser() user: User_Interface) {
    return this.ordenCompraService.crear_varios(createOrdenCompraDto, user);
  }

  @Get()
  findAll(@ActiveUser() user: User_Interface) {
    return this.ordenCompraService.findAll(user);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @ActiveUser() user: User_Interface) {
    return this.ordenCompraService.findOne(+id, user);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateOrdenCompraDto: UpdateOrdenCompraDto, @ActiveUser() user: User_Interface) {
    return this.ordenCompraService.update(+id, updateOrdenCompraDto, user);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @ActiveUser() user: User_Interface) {
    return this.ordenCompraService.remove(+id, user);
  }
}
