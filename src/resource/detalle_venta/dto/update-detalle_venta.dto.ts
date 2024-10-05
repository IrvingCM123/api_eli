import { PartialType } from '@nestjs/mapped-types';
import { CreateDetalleVentaDto } from './create-detalle_venta.dto';

import { IsNotEmpty, IsNumber, IsString, MaxLength } from 'class-validator';
import { Mensajes_Generales } from 'src/common/helpers/general.helpers';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateDetalleVentaDto extends PartialType(CreateDetalleVentaDto) {

    @ApiProperty({ description: 'Cantidad de productos', example: 10, uniqueItems: false, nullable: false, type: 'number' })
    @IsNumber({}, { message: Mensajes_Generales.CAMPO_NUMBER })
    @IsNotEmpty({ message: Mensajes_Generales.CAMPO_VACIO })
    venta_cantidad_productos: number;

    @ApiProperty({ description: 'Precio de venta del producto', example: 10.5, uniqueItems: false, nullable: false, type: 'number' })
    @IsNumber({}, { message: Mensajes_Generales.CAMPO_NUMBER })
    @IsNotEmpty({ message: Mensajes_Generales.CAMPO_VACIO })
    venta_monto_total: number;

    @ApiProperty({ description: 'Correo del cliente', example: ' Sabritas@Gmail.com', uniqueItems: false, nullable: true, type: 'string', minLength: 1, maxLength: 50 })
    @IsString({ message: Mensajes_Generales.CAMPO_STRING })
    @MaxLength(50, { message: Mensajes_Generales.TAMAÑO_MAXIMO })
    detalle_Venta_CorreoCliente: string;

    @ApiProperty({ description: 'Producto de la venta', example: 1, uniqueItems: false, nullable: false, type: 'number' })
    @IsNotEmpty({ message: Mensajes_Generales.CAMPO_VACIO })
    id_Producto: producto[];

    @ApiProperty({ description: 'Cuenta del producto', example: 1, uniqueItems: false, nullable: false, type: 'number' })
    @IsNumber({}, { message: Mensajes_Generales.CAMPO_NUMBER })
    @IsNotEmpty({ message: Mensajes_Generales.CAMPO_VACIO })
    cuenta_ID: any;

}

class producto {

    @IsString({ message: Mensajes_Generales.CAMPO_STRING })
    @IsNotEmpty({ message: Mensajes_Generales.CAMPO_VACIO })
    id_Producto: number;

    @IsNumber({}, { message: Mensajes_Generales.CAMPO_NUMBER })
    @IsNotEmpty({ message: Mensajes_Generales.CAMPO_VACIO })
    cantidad_Producto: number;

    @IsNumber({}, { message: Mensajes_Generales.CAMPO_NUMBER })
    @IsNotEmpty({ message: Mensajes_Generales.CAMPO_VACIO })
    monto_Subtotal: number;

}
