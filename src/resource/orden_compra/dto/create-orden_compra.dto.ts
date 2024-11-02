import { IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength } from 'class-validator';
import { Mensajes_Generales } from 'src/common/helpers/general.helpers';
import { ApiProperty } from '@nestjs/swagger';
import { CreateDetalleOrdenCompraDto } from 'src/resource/detalle_orden_compra/dto/create-detalle_orden_compra.dto';

export class CreateOrdenCompraDto {

    @ApiProperty({ description: 'Estado de la orden de compra', example: 'PAGADO-PENDIENTE-CANCELADO', uniqueItems: false, nullable: false, type: 'string', minLength: 1, maxLength: 30 })
    @IsString({ message: Mensajes_Generales.CAMPO_STRING })
    @IsNotEmpty({ message: Mensajes_Generales.CAMPO_VACIO })
    @MaxLength(30, { message: Mensajes_Generales.TAMAÑO_MAXIMO })
    orden_compra_estado: string;

    @ApiProperty({ description: 'Fecha de la orden de compra', example: '2021-10-10', uniqueItems: false, nullable: false, type: 'string' })
    @IsString({ message: Mensajes_Generales.CAMPO_STRING })
    @IsOptional()
    orden_compra_fecha_ordenado: string;

    @ApiProperty({ description: 'Fecha de entrega de la orden de compra', example: '2021-10-10', uniqueItems: false, nullable: true, type: 'string' })
    @IsString({ message: Mensajes_Generales.CAMPO_STRING })
    @IsOptional()
    orden_compra_fecha_entregado: string;

    @ApiProperty({ description: 'Detalle de la orden de compra', example: [{ detalleOC_Cantidad_Producto: 10, detalleOC_MontoTotal: 10.5, detalleOC_Proveedor_ID: 1, detalleOC_Cuenta_ID: 1, detalleOC_ProductoOC: [{ productoOC_Producto_ID: 1, productoOC_Cantidad_Producto: 10, productoOC_Subtotal_OC: 10.5, productoOC_Nombre_Producto: 'Papas' }] }], uniqueItems: false, nullable: false, type: 'array', items: { type: 'object', properties: { detalleOC_Cantidad_Producto: { type: 'number' }, detalleOC_MontoTotal: { type: 'number' }, detalleOC_Proveedor_ID: { type: 'number' }, detalleOC_Cuenta_ID: { type: 'number' }, detalleOC_ProductoOC: { type: 'array', items: { type: 'object', properties: { productoOC_Producto_ID: { type: 'number' }, productoOC_Cantidad_Producto: { type: 'number' }, productoOC_Subtotal_OC: { type: 'number' }, productoOC_Nombre_Producto: { type: 'string' } } } } } } })
    @IsNotEmpty({ message: Mensajes_Generales.CAMPO_VACIO })
    detalle_orden_compra: CreateDetalleOrdenCompraDto[];
}

export class carritoCompras {

    @ApiProperty({ description: 'Detalle de la orden de compra', example: [{ detalleOC_Cantidad_Producto: 10, detalleOC_MontoTotal: 10.5, detalleOC_Proveedor_ID: 1, detalleOC_Cuenta_ID: 1, detalleOC_ProductoOC: [{ productoOC_Producto_ID: 1, productoOC_Cantidad_Producto: 10, productoOC_Subtotal_OC: 10.5, productoOC_Nombre_Producto: 'Papas' }] }], uniqueItems: false, nullable: false, type: 'array', items: { type: 'object', properties: { detalleOC_Cantidad_Producto: { type: 'number' }, detalleOC_MontoTotal: { type: 'number' }, detalleOC_Proveedor_ID: { type: 'number' }, detalleOC_Cuenta_ID: { type: 'number' }, detalleOC_ProductoOC: { type: 'array', items: { type: 'object', properties: { productoOC_Producto_ID: { type: 'number' }, productoOC_Cantidad_Producto: { type: 'number' }, productoOC_Subtotal_OC: { type: 'number' }, productoOC_Nombre_Producto: { type: 'string' } } } } } } })
    @IsNotEmpty({ message: Mensajes_Generales.CAMPO_VACIO })    
    ordenes_compra: CreateOrdenCompraDto[];
}
