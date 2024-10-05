import { PartialType } from '@nestjs/mapped-types';
import { CreateCuentaDto } from './create-cuenta.dto';

import { IsNotEmpty, IsString, IsNumber, IsBoolean, IsOptional } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class UpdateCuentaDto extends PartialType(CreateCuentaDto) {

    
    @ApiProperty({
        description: 'Correo de la cuenta',
        type: String,
        required: true,
        default: ''
    })
    @IsString()
    @IsNotEmpty()
    cuenta_correo: string;

    @ApiProperty({
        description: 'Contraseña de la cuenta',
        type: String,
        required: true,
        default: ''
    })
    @IsString()
    @IsNotEmpty()
    cuenta_contrasena: string;

    @ApiProperty({
        description: 'Rol de la cuenta',
        type: String,
        required: true,
        example: 'ADMIN, SECRE, RF',
        default: 'ADMIN'
    })
    @IsString()
    @IsNotEmpty()
    cuenta_rol: string;

}
