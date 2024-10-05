import { PartialType } from '@nestjs/mapped-types';
import { CreateVentaDto } from './create-venta.dto';

import { IsNotEmpty, IsNumber, IsString, MaxLength } from 'class-validator';
import { Mensajes_Generales } from 'src/common/helpers/general.helpers';
import { ApiProperty } from '@nestjs/swagger';
import { EstadoVenta } from 'src/common/enums/estado_Venta.enum';

export class UpdateVentaDto extends PartialType(CreateVentaDto) {

    @ApiProperty({ description: 'Estado de la venta', example: 'Pendiente', uniqueItems: false, nullable: false, type: 'string', minLength: 1, maxLength: 50 })
    @IsString({ message: Mensajes_Generales.CAMPO_STRING })
    @MaxLength(50, { message: Mensajes_Generales.TAMAÑO_MAXIMO })
    venta_EstadoVenta: EstadoVenta;

}
