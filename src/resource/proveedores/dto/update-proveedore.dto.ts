import { PartialType } from '@nestjs/mapped-types';
import { CreateProveedoreDto } from './create-proveedore.dto';

import { IsNotEmpty, IsString, IsNumber, MaxLength } from 'class-validator';
import { Mensajes_Generales } from 'src/common/helpers/general.helpers';
import { ApiProperty } from '@nestjs/swagger';
import { Transaccion_Bancaria } from 'src/common/enums/transaccion_bancaria.enum';

export class UpdateProveedoreDto extends PartialType(CreateProveedoreDto) {

    @ApiProperty({ description: 'Nombre del proveedor', example: 'Sabritas S.A de C.V ', uniqueItems: false, nullable: false, type: 'string', minLength: 1, maxLength: 30 })
    @IsString(  { message: Mensajes_Generales.CAMPO_STRING })
    @IsNotEmpty({ message: Mensajes_Generales.CAMPO_VACIO })
    proveedor_Nombre: string;

    @ApiProperty({ description: 'Dirección del proveedor', example: 'Oriente 49. Orizaba, Ver', uniqueItems: false, nullable: false, type: 'string', minLength: 1, maxLength: 30 })
    @IsString(  { message: Mensajes_Generales.CAMPO_STRING })
    @IsNotEmpty({ message: Mensajes_Generales.CAMPO_VACIO })
    proveedor_Direccion: string;

    @ApiProperty({ description: 'Teléfono del proveedor', example: '2721495728', uniqueItems: false, nullable: false, type: 'number' })
    @IsNumber(  { }, { message: Mensajes_Generales.CAMPO_NUMBER })
    @IsNotEmpty({ message: Mensajes_Generales.CAMPO_VACIO })
    proveedor_Telefono: number;

    @ApiProperty({ description: 'Correo electrónico del proveedor', example: 'Sabritas@Gmail.com', uniqueItems: false, nullable: false, type: 'string', minLength: 1, maxLength: 30 })
    @IsString(  { message: Mensajes_Generales.CAMPO_STRING })
    @IsNotEmpty({ message: Mensajes_Generales.CAMPO_VACIO })
    proveedor_Email: string;

    @ApiProperty({ description: 'URL del catálogo del proveedor', example: 'www.sabritas.com/catalogo', uniqueItems: false, nullable: false, type: 'string', minLength: 1, maxLength: 30 })
    @IsString(  { message: Mensajes_Generales.CAMPO_STRING })
    @IsNotEmpty({ message: Mensajes_Generales.CAMPO_VACIO })
    proveedor_Catalogo: string;

    @ApiProperty({ description: 'Número de cuenta bancaria del proveedor', example: '8923130214', uniqueItems: false, nullable: false, type: 'number' })
    @IsNumber(  { }, { message: Mensajes_Generales.CAMPO_NUMBER })
    @IsNotEmpty({ message: Mensajes_Generales.CAMPO_VACIO })
    proveedorBanco_CuentaBancaria: number;

    @ApiProperty({ description: 'Nombre del banco del proveedor', example: 'Banco Azteca', uniqueItems: false, nullable: false, type: 'string', minLength: 1, maxLength: 30 })
    @IsString(  { message: Mensajes_Generales.CAMPO_STRING })
    @IsNotEmpty({ message: Mensajes_Generales.CAMPO_VACIO })
    proveedorBanco_NombreBanco: string;

    @ApiProperty({ description: 'Nombre del beneficiario de la cuenta bancaria del proveedor', example: 'Eli Galindo', uniqueItems: false, nullable: false, type: 'string', minLength: 1, maxLength: 30 })
    @IsString(  { message: Mensajes_Generales.CAMPO_STRING })
    @IsNotEmpty({ message: Mensajes_Generales.CAMPO_VACIO })
    proveedorBanco_NombreBeneficiario: string;

    @ApiProperty({ description: 'Tipo de transacción del proveedor', example: 'Transferencia', uniqueItems: false, nullable: false, type: 'string', minLength: 1, maxLength: 30 })
    @IsString(  { message: Mensajes_Generales.CAMPO_STRING })
    @IsNotEmpty({ message: Mensajes_Generales.CAMPO_VACIO })
    proveedorBanco_TipoTransaccion: Transaccion_Bancaria;

}