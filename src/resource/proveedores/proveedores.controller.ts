import { Controller, Get, Post, Body, Patch, Param, Delete, Put } from '@nestjs/common';
import { ProveedoresService } from './proveedores.service';
import { CreateProveedoreDto } from './dto/create-proveedore.dto';
import { UpdateProveedoreDto } from './dto/update-proveedore.dto';
import { ApiTags } from '@nestjs/swagger';

import { Auth } from 'src/auth/decorators/auth.decorator';
import { Roles } from 'src/common/enums/roles.enum';
import { ActiveUser } from 'src/common/decorators/user.decorator';
import { User_Interface } from 'src/common/interfaces/user.interface';

@ApiTags('proveedores_controller')
@Auth(Roles.ADMIN)
@Auth(Roles.SECRE)
@Auth(Roles.RF)
@Controller('proveedores')
export class ProveedoresController {
  constructor(private readonly proveedoresService: ProveedoresService) {}

  @Post()
  create(@Body() createProveedoreDto: CreateProveedoreDto, @ActiveUser() user: User_Interface) {
    return this.proveedoresService.create(createProveedoreDto, user);
  }

  @Get()
  findAll(@ActiveUser() user: User_Interface) {
    return this.proveedoresService.findAll(user);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @ActiveUser() user: User_Interface) {
    return this.proveedoresService.findOne(id, user);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateProveedoreDto: UpdateProveedoreDto, @ActiveUser() user: User_Interface) {
    return this.proveedoresService.update(+id, updateProveedoreDto, user);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @ActiveUser() user: User_Interface) {
    return this.proveedoresService.remove(+id, user);
  }
}
