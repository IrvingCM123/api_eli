import { PartialType } from '@nestjs/mapped-types';
import { CreateProductoDto } from './create-producto.dto';

import { IsNotEmpty, IsNumber, IsString, MaxLength } from 'class-validator';
import { Mensajes_Generales } from 'src/common/helpers/general.helpers';
import { ApiProperty } from '@nestjs/swagger';
import { enumProductoStatus } from 'src/common/enums/inventario_status.enum';

export class UpdateProductoDto extends PartialType(CreateProductoDto) {

    @ApiProperty({ description: 'Nombre del producto', example: 'Papas', uniqueItems: false, nullable: false, type: 'string', minLength: 1, maxLength: 30 })
    @IsString({ message: Mensajes_Generales.CAMPO_STRING })
    @IsNotEmpty({ message: Mensajes_Generales.CAMPO_VACIO })
    @MaxLength(30, { message: Mensajes_Generales.TAMAÑO_MAXIMO })
    producto_nombre: string;

    @ApiProperty({ description: 'Categoría del producto', example: 'Botanas', uniqueItems: false, nullable: false, type: 'string', minLength: 1, maxLength: 30 })
    @IsString({ message: Mensajes_Generales.CAMPO_STRING })
    @IsNotEmpty({ message: Mensajes_Generales.CAMPO_VACIO })
    @MaxLength(30, { message: Mensajes_Generales.TAMAÑO_MAXIMO })
    producto_categoria: string;

    @ApiProperty({ description: 'Proveedor del producto', example: 'Sabritas S.A de C.V', uniqueItems: false, nullable: false, type: 'string', minLength: 1, maxLength: 255 })
    @IsString({ message: Mensajes_Generales.CAMPO_STRING })
    @IsNotEmpty({ message: Mensajes_Generales.CAMPO_VACIO })
    producto_proveedor: string;

    @ApiProperty({ description: 'Estado del producto', example: 'Activo', uniqueItems: false, nullable: false, type: 'string' })
    @IsString({ message: Mensajes_Generales.CAMPO_STRING })
    @IsNotEmpty({ message: Mensajes_Generales.CAMPO_VACIO })
    producto_Status: enumProductoStatus;

    @ApiProperty({ description: 'Precio del producto', example: '15.50', uniqueItems: false, nullable: false, type: 'number' })
    @IsNumber({}, { message: Mensajes_Generales.CAMPO_NUMBER })
    @IsNotEmpty({ message: Mensajes_Generales.CAMPO_VACIO })
    producto_precio: number;

    @ApiProperty({ description: 'Stock del producto', example: '100', uniqueItems: false, nullable: false, type: 'number' })
    @IsNumber({}, { message: Mensajes_Generales.CAMPO_NUMBER })
    @IsNotEmpty({ message: Mensajes_Generales.CAMPO_VACIO })
    producto_stock: number;
    
    @ApiProperty({ description: 'Imagen del producto', example: 'https://www.google.com.mx', uniqueItems: false, nullable: false, type: 'string', minLength: 1, maxLength: 255 })
    @IsString({ message: Mensajes_Generales.CAMPO_STRING })
    @IsNotEmpty({ message: Mensajes_Generales.CAMPO_VACIO })
    @MaxLength(255, { message: Mensajes_Generales.TAMAÑO_MAXIMO })
    producto_imagen: string;
}
