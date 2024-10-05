import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { InventarioService } from './inventario.service';
import { CreateInventarioDto } from './dto/create-inventario.dto';
import { UpdateInventarioDto } from './dto/update-inventario.dto';
import { ApiTags } from '@nestjs/swagger';

import { Auth } from 'src/auth/decorators/auth.decorator';
import { Roles } from 'src/common/enums/roles.enum';
import { ActiveUser } from 'src/common/decorators/user.decorator';
import { User_Interface } from 'src/common/interfaces/user.interface';

// Se inyecta el decorador de Auth, permitiendo que solo los Administradores puedan acceder a los métodos de la clase
@Auth(Roles.ADMIN)
@ApiTags('inventario_controller')
@Controller('inventario')
export class InventarioController {

  // Se inyecta el servicio InventarioService en el controlador InventarioController
  constructor(private readonly inventarioService: InventarioService) {}

  // Define el método create, que recibe un objeto de tipo CreateInventarioDto y un objeto de tipo User_Interface para acceder al rol del usuario
  @Post()
  create(@Body() createInventarioDto: CreateInventarioDto, @ActiveUser() user: User_Interface) {
    return this.inventarioService.create(createInventarioDto, user);
  }

  // Define el método actualizarInventario, que recibe un identificador de tipo cadena de texto y un objeto de tipo número, para actualizar la cantidad de productos en inventario
  @Post('actualizarInventario/:id')
  actualizarInventario(@Param('id') id: string, @Body() cantidad: number, @ActiveUser() user: User_Interface) {
    return this.inventarioService.actualizarInventario (id, cantidad, user);
  }

  // Define el método findAll, que recibe un objeto de tipo User_Interface para acceder al rol del usuario
  @Get()
  findAll(@ActiveUser() user: User_Interface) {
    return this.inventarioService.findAll(user);
  }

  // Define el método remove, que recibe un identificador de tipo cadena de texto y un objeto de tipo User_Interface para acceder al rol del usuario
  @Delete(':id')
  remove(@Param('id') id: string, @ActiveUser() user: User_Interface) {
    return this.inventarioService.remove(+id, user);
  }
}
