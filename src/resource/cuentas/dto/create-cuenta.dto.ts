import { Transform } from "class-transformer";

import { IsNotEmpty, IsString, IsNumber, IsBoolean, IsOptional } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateCuentaDto {

    @ApiProperty({
        description: 'Correo de la cuenta',
        type: String,
        required: true,
        example: 'EliGalindo@Gmail.com',
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

    @ApiProperty({
        description: 'Fecha de registro de la cuenta',
        type: Date,
        required: false,
        default: ''
    })
    @IsOptional()
    @Transform(({ value }) => new Date(value))
    cuenta_Fecha_Registro?: Date;


}
