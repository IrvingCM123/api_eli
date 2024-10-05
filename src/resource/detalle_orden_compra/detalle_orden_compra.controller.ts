import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { DetalleOrdenCompraService } from './detalle_orden_compra.service';
import { CreateDetalleOrdenCompraDto } from './dto/create-detalle_orden_compra.dto';
import { UpdateDetalleOrdenCompraDto } from './dto/update-detalle_orden_compra.dto';
import { ApiTags } from '@nestjs/swagger';

import { Auth } from 'src/auth/decorators/auth.decorator';
import { Roles } from 'src/common/enums/roles.enum';

// Inyecta el decorador Auth y Roles para restringir el acceso a los endpoints, habilitando el rol de administrador
@Auth(Roles.ADMIN)
// Inyecta el decorador ApiTags para documentar el nombre del controlador en la documentación de la API
@ApiTags('detalle_orden_compra_controller')
// Define el controlador de la entidad DetalleOrdenCompra
@Controller('detalle-orden-compra')
export class DetalleOrdenCompraController {
  // Inyecta el servicio DetalleOrdenCompraService en el controlador
  constructor(private readonly detalleOrdenCompraService: DetalleOrdenCompraService) {}

  // Define la ruta de tipo POST para crear un nuevo detalle de orden de compra, utilizada por el sistema 
  @Post()
  create(@Body() createDetalleOrdenCompraDto: CreateDetalleOrdenCompraDto) {
    return this.detalleOrdenCompraService.create(createDetalleOrdenCompraDto);
  }

  // Define la ruta de tipo PATCH para actualizar los detalles de orden de compra, utilizada por el sistema
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDetalleOrdenCompraDto: UpdateDetalleOrdenCompraDto) {
    return this.detalleOrdenCompraService.update(+id, updateDetalleOrdenCompraDto);
  }

}
