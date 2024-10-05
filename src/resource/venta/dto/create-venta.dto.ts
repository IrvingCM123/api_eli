import { IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength } from 'class-validator';
import { Mensajes_Generales } from 'src/common/helpers/general.helpers';
import { ApiProperty } from '@nestjs/swagger';
import { EstadoVenta } from 'src/common/enums/estado_Venta.enum';

export class CreateVentaDto {

    @ApiProperty({ description: 'Estado de la venta', example: 'Pendiente', uniqueItems: false, nullable: false, type: 'string', minLength: 1, maxLength: 50 })
    @IsString({ message: Mensajes_Generales.CAMPO_STRING })
    @MaxLength(50, { message: Mensajes_Generales.TAMAÑO_MAXIMO })
    venta_EstadoVenta: EstadoVenta;

    @ApiProperty({ description: 'Cantidad de productos', example: 10, uniqueItems: false, nullable: false, type: 'number' })
    @IsNumber({}, { message: Mensajes_Generales.CAMPO_NUMBER })
    @IsNotEmpty({ message: Mensajes_Generales.CAMPO_VACIO })
    detalleVenta_TotalProductosVendidos: number;

    @ApiProperty({ description: 'Precio de venta del producto', example: 10.5, uniqueItems: false, nullable: false, type: 'number' })
    @IsNumber({}, { message: Mensajes_Generales.CAMPO_NUMBER })
    @IsNotEmpty({ message: Mensajes_Generales.CAMPO_VACIO })
    detalleVenta_MontoTotal: number;

    @ApiProperty({ description: 'Correo del cliente', example: ' Sabritas@Gmail.com', uniqueItems: false, nullable: true, type: 'string', minLength: 1, maxLength: 50 })
    @IsString({ message: Mensajes_Generales.CAMPO_STRING })
    @MaxLength(50, { message: Mensajes_Generales.TAMAÑO_MAXIMO })
    @IsOptional()
    detalleVentaCorreoCliente: string;

    @ApiProperty({ description: 'Nombre del cliente', example: 'Sabritas', uniqueItems: false, nullable: true, type: 'string', minLength: 1, maxLength: 50 })
    @IsString({ message: Mensajes_Generales.CAMPO_STRING })
    @MaxLength(50, { message: Mensajes_Generales.TAMAÑO_MAXIMO })
    @IsOptional()
    detalleVentaNombreCliente: string;

    @ApiProperty({ description: 'Objetos de la clase Producto', example: [{ id_Producto: 1, cantidad_Producto: 10, monto_Subtotal: 10.5 }], uniqueItems: false, nullable: false, type: 'array', items: { type: 'object', properties: { id_Producto: { type: 'number' }, cantidad_Producto: { type: 'number' }, monto_Subtotal: { type: 'number' } } } })
    @IsNotEmpty({ message: Mensajes_Generales.CAMPO_VACIO })
    producto_ID: Producto[];
    
    @ApiProperty({ description: 'Cuenta del producto', example: 1, uniqueItems: false, nullable: false, type: 'number' })
    @IsNumber({}, { message: Mensajes_Generales.CAMPO_NUMBER })
    @IsNotEmpty({ message: Mensajes_Generales.CAMPO_VACIO })
    cuenta_ID: number;

}

class Producto {

    @ApiProperty({ description: 'Identificador del producto', example: 1, uniqueItems: false, nullable: false, type: 'number' })
    @IsString({ message: Mensajes_Generales.CAMPO_STRING })
    @IsNotEmpty({ message: Mensajes_Generales.CAMPO_VACIO })
    productoVenta_ProductoID: number;

    @ApiProperty({ description: 'Nombre del producto', example: 'Papas', uniqueItems: false, nullable: false, type: 'string', minLength: 1, maxLength: 30 })
    @IsNotEmpty({ message: Mensajes_Generales.CAMPO_VACIO })
    productoVenta_NombreProducto: string;

    @ApiProperty({ description: 'Cantidad de productos', example: 10, uniqueItems: false, nullable: false, type: 'number' })
    @IsNumber({}, { message: Mensajes_Generales.CAMPO_NUMBER })
    @IsNotEmpty({ message: Mensajes_Generales.CAMPO_VACIO })
    productoVenta_CantidadProducto: number;

    @ApiProperty({ description: 'Precio del producto', example: 10.5, uniqueItems: false, nullable: false, type: 'number' })
    @IsNumber({}, { message: Mensajes_Generales.CAMPO_NUMBER })
    @IsNotEmpty({ message: Mensajes_Generales.CAMPO_VACIO })
    productoVenta_PrecioProducto: number;

    @ApiProperty({ description: 'Subtotal de la venta', example: 105, uniqueItems: false, nullable: false, type: 'number' })
    @IsNumber({}, { message: Mensajes_Generales.CAMPO_NUMBER })
    @IsNotEmpty({ message: Mensajes_Generales.CAMPO_VACIO })
    productoVenta_SubtotalVenta: number;

}