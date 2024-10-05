import { PartialType } from '@nestjs/mapped-types';
import { CreateDetalleOrdenCompraDto } from './create-detalle_orden_compra.dto';
import { IsNotEmpty, IsNumber, IsString, MaxLength } from 'class-validator';
import { Mensajes_Generales } from 'src/common/helpers/general.helpers';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateDetalleOrdenCompraDto extends PartialType(CreateDetalleOrdenCompraDto) {

    @ApiProperty({ description: 'Cantidad de productos', example: 10, uniqueItems: false, nullable: false, type: 'number' })
    @IsNumber({}, { message: Mensajes_Generales.CAMPO_NUMBER })
    @IsNotEmpty({ message: Mensajes_Generales.CAMPO_VACIO })
    detalle_orden_compra_cantidad: number;

    @ApiProperty({ description: 'Precio de compra del producto', example: 10.5, uniqueItems: false, nullable: false, type: 'number' })
    @IsNumber({}, { message: Mensajes_Generales.CAMPO_NUMBER })
    @IsNotEmpty({ message: Mensajes_Generales.CAMPO_VACIO })
    detalle_orden_compra_montoTotal: number;

    @ApiProperty({ description: 'Producto de la orden de compra', example: 1, uniqueItems: false, nullable: false, type: 'number' })
    @IsNotEmpty({ message: Mensajes_Generales.CAMPO_VACIO })
    id_Producto: any;

    @ApiProperty({ description: 'Proveedor del producto', example: 1, uniqueItems: false, nullable: false, type: 'number' })
    @IsNumber({}, { message: Mensajes_Generales.CAMPO_NUMBER })
    @IsNotEmpty({ message: Mensajes_Generales.CAMPO_VACIO })
    id_Proveedor: number;

    @ApiProperty({ description: 'Cuenta del producto', example: 1, uniqueItems: false, nullable: false, type: 'number' })
    @IsNumber({}, { message: Mensajes_Generales.CAMPO_NUMBER })
    @IsNotEmpty({ message: Mensajes_Generales.CAMPO_VACIO })
    cuenta_ID: number;

}
