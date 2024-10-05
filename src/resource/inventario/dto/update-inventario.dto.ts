import { PartialType } from '@nestjs/mapped-types';
import { CreateInventarioDto } from './create-inventario.dto';

import { IsNotEmpty, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Mensajes_Generales } from 'src/common/helpers/general.helpers';

export class UpdateInventarioDto extends PartialType(CreateInventarioDto) {

    @ApiProperty({ description: 'Cantidad de productos en inventario', example: '100', uniqueItems: false, nullable: false, type: 'number' })
    @IsNumber({}, { message: Mensajes_Generales.CAMPO_NUMBER })
    @IsNotEmpty({ message: Mensajes_Generales.CAMPO_VACIO })
    inventario_Cantidad: number;

    @ApiProperty({ description: 'ID del producto en inventario', example: '1', uniqueItems: false, nullable: false, type: 'number' })
    @IsNumber({}, { message: Mensajes_Generales.CAMPO_NUMBER })
    @IsNotEmpty({ message: Mensajes_Generales.CAMPO_VACIO })
    inventario_ProductoID: number;
    
}
