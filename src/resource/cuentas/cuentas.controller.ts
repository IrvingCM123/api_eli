import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CuentasService } from './cuentas.service';
import { CreateCuentaDto } from './dto/create-cuenta.dto';
import { UpdateCuentaDto } from './dto/update-cuenta.dto';

import { Auth } from 'src/auth/decorators/auth.decorator';
import { Roles } from 'src/common/enums/roles.enum';
import { ActiveUser } from 'src/common/decorators/user.decorator';
import { User_Interface } from 'src/common/interfaces/user.interface';
import { Estado } from 'src/common/enums/cuentas.enum';

import { ApiTags } from '@nestjs/swagger';

@ApiTags('cuentas_controller')
@Auth(Roles.ADMIN)
@Controller('cuentas')
export class CuentasController {
  constructor(private readonly cuentasService: CuentasService) {}

  @Post()
  create(@Body() createCuentaDto: CreateCuentaDto) {
    return this.cuentasService.create(createCuentaDto);
  }

  @Get()
  findAll() {
    return this.cuentasService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.cuentasService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCuentaDto: UpdateCuentaDto, @ActiveUser() user: User_Interface) {
    return this.cuentasService.update(id, updateCuentaDto, user);
  }

  @Patch('actualizarCuenta/:identificador')
  actualizarEstadoCuenta(@Param('identificador') identificador: string, @Body() estado_cuenta: Estado, @ActiveUser() user: User_Interface) {
    let estado: any = estado_cuenta;
    estado = estado.estado_cuenta;
    return this.cuentasService.actualizarEstadoCuenta(identificador, estado, user);
  }

  @Patch('actualizarContrasena/:identificador')
  actualizarContraseña(@Param('identificador') identificador: string, @Body() contrasena: string, @ActiveUser() user: User_Interface) {
    return this.cuentasService.actualizarContraseña(identificador, contrasena, user );
  }

  @Delete(':id')
  remove(@Param('id') id: string, @ActiveUser() user: User_Interface) {
    return this.cuentasService.remove(id, user);
  }

}
