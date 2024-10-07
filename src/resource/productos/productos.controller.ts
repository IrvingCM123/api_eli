import { Controller, Get, Post, Body, Patch, Param, Delete, Put } from '@nestjs/common';
import { ProductosService } from './productos.service';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';
import { ApiTags } from '@nestjs/swagger';

import { Auth } from 'src/auth/decorators/auth.decorator';
import { Roles } from 'src/common/enums/roles.enum';
import { ActiveUser } from 'src/common/decorators/user.decorator';
import { User_Interface } from 'src/common/interfaces/user.interface';

interface EliminarProducto {
  id: string;
  cantidad: number;
}
@Auth(Roles.ADMIN)
@ApiTags('productos_controller')
@Controller('productos')
export class ProductosController {
  constructor(private readonly productosService: ProductosService) {}

  @Post()
  create(@Body() createProductoDto: CreateProductoDto, @ActiveUser() user: User_Interface) {
    return this.productosService.create(createProductoDto, user);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateProductoDto: UpdateProductoDto, @ActiveUser() user: User_Interface) {
    return this.productosService.update(+id, updateProductoDto, user);
  }

  @Put('/activarProducto/:id')
  activar(@Param('id') id: string, @ActiveUser() user: User_Interface) {
    return this.productosService.activar(+id, user);
  }

  @Delete(':id')
  eliminar(@Param('id') id: string, @ActiveUser() user: User_Interface) {
    return this.productosService.eliminar(+id, user);
  }

}
