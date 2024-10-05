import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { Mensajes_Login_DTO } from 'src/common/helpers/login.helpers';

import {
    IsNotEmpty,
    IsString,
    Matches,
    MaxLength,
    MinLength,
} from 'class-validator';

export class LoginDto {

    @ApiProperty({
        description: 'Debe ser un correo electrónico válido. Acepta letras, números y caracteres especiales como . _ % + -',
        example: 'EliGalindo@Gmail.com',
    })
    @IsNotEmpty()
    @Matches(/^(?:[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/, {
        message: Mensajes_Login_DTO.MENSAJE_IDENTIFICADOR,
    }) 
    Correo_electronico: string;

    @ApiProperty({
        description: 'Contraseña entre 8 y 20 caracteres',
        example: 'MiC0ntraseñ@123',
    })
    @IsNotEmpty()
    @IsString()
    @MinLength(8)
    @MaxLength(20)
    @Transform(({ value }) => value.trim())
    Contraseña : string;

    // Usuario, Estado, Telefono
}
