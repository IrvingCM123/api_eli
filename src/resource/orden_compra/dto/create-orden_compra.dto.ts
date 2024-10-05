import { IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength } from 'class-validator';
import { Mensajes_Generales } from 'src/common/helpers/general.helpers';
import { ApiProperty } from '@nestjs/swagger';

export class CreateOrdenCompraDto {

    @ApiProperty({ description: 'Estado de la orden de compra', example: 'PAGADO-PENDIENTE-CANCELADO', uniqueItems: false, nullable: false, type: 'string', minLength: 1, maxLength: 30 })
    @IsString({ message: Mensajes_Generales.CAMPO_STRING })
    @IsNotEmpty({ message: Mensajes_Generales.CAMPO_VACIO })
    @MaxLength(30, { message: Mensajes_Generales.TAMAÑO_MAXIMO })
    orden_compra_estado: string;

    @ApiProperty({ description: 'Fecha de la orden de compra', example: '2021-10-10', uniqueItems: false, nullable: false, type: 'string' })
    @IsString({ message: Mensajes_Generales.CAMPO_STRING })
    orden_compra_fecha_ordenado: string;

    @ApiProperty({ description: 'Fecha de entrega de la orden de compra', example: '2021-10-10', uniqueItems: false, nullable: true, type: 'string' })
    @IsString({ message: Mensajes_Generales.CAMPO_STRING })
    @IsOptional()
    orden_compra_fecha_entregado: string;

    @ApiProperty({ description: 'Cantidad de productos', example: 10, uniqueItems: false, nullable: false, type: 'number' })
    @IsNumber({}, { message: Mensajes_Generales.CAMPO_NUMBER })
    @IsNotEmpty({ message: Mensajes_Generales.CAMPO_VACIO })
    detalleOC_Cantidad_Producto: number;

    @ApiProperty({ description: 'Precio de compra del producto', example: 10.5, uniqueItems: false, nullable: false, type: 'number' })
    @IsNumber({}, { message: Mensajes_Generales.CAMPO_NUMBER })
    @IsNotEmpty({ message: Mensajes_Generales.CAMPO_VACIO })
    detalleOC_MontoTotal: number;

    @ApiProperty({ description: 'Proveedor del producto', example: 1, uniqueItems: false, nullable: false, type: 'number' })
    @IsNumber({}, { message: Mensajes_Generales.CAMPO_NUMBER })
    @IsNotEmpty({ message: Mensajes_Generales.CAMPO_VACIO })
    detalleOC_Proveedor_ID: number;

    @ApiProperty({ description: 'Cuenta del producto', example: 1, uniqueItems: false, nullable: false, type: 'number' })
    @IsNumber({}, { message: Mensajes_Generales.CAMPO_NUMBER })
    @IsNotEmpty({ message: Mensajes_Generales.CAMPO_VACIO })
    detalleOC_Cuenta_ID: number;

    @ApiProperty({ description: 'Productos de la orden de compra', example: [{ productoOC_Producto_ID: 1, productoOC_Nombre_Producto: 'Papas', productoOC_Cantidad_Producto: 10, productoOC_Subtotal_OC: 105 }], uniqueItems: false, nullable: false, type: 'array' })
    @IsNotEmpty({ message: Mensajes_Generales.CAMPO_VACIO })
    detalleOC_ProductoOC: productoOC[];
}

export class productoOC {

    @ApiProperty({ description: 'Identificador del producto', example: 1, uniqueItems: false, nullable: false, type: 'number' })
    @IsNumber({}, { message: Mensajes_Generales.CAMPO_NUMBER })
    @IsNotEmpty({ message: Mensajes_Generales.CAMPO_VACIO })
    productoOC_Cantidad_Producto: number;

    @ApiProperty({ description: 'Precio de compra del producto', example: 10.5, uniqueItems: false, nullable: false, type: 'number' })
    @IsNumber({}, { message: Mensajes_Generales.CAMPO_NUMBER })
    @IsOptional()
    productoOC_Subtotal_OC: number;

    @ApiProperty({ description: 'Nombre del producto', example: 'Papas', uniqueItems: false, nullable: false, type: 'string', minLength: 1, maxLength: 30 })
    @IsString({ message: Mensajes_Generales.CAMPO_STRING })
    @IsNotEmpty({ message: Mensajes_Generales.CAMPO_VACIO })
    productoOC_Nombre_Producto: string;

    @ApiProperty({ description: 'ID del producto', example: 1, uniqueItems: false, nullable: false, type: 'number' })
    @IsNumber({}, { message: Mensajes_Generales.CAMPO_NUMBER })
    @IsNotEmpty({ message: Mensajes_Generales.CAMPO_VACIO })
    productoOC_Producto_ID: number;

}