import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsOptional, IsString, Matches, MaxLength, MinLength } from 'class-validator';
import { Roles } from 'src/common/enums/roles.enum';
import { Mensajes_Error_Registro } from 'src/common/helpers/registro.helpers';

export class RegisterDto {

    @ApiProperty({
        description: 'Nombre de usuario',
        example: 'Eli',
        type: String,
        required: true,
    })
    @IsString()
    @MaxLength(50)
    Nombre: string;

    @ApiProperty({
        description: 'Apellidos de usuario',
        example: 'Galindo',
        type: String,
        required: true,
    })
    @IsString()
    @MaxLength(50)
    Apellidos: string;

    @ApiProperty({
        description: 'Debe ser un correo electrónico válido. Acepta letras, números y caracteres especiales como . _ % + -',
        example: 'EliGalindo@Gmail.com',
        type: String,
        required: true,
    })
    @IsNotEmpty() //CaracteresAqui@Caracteres.com 
    @Matches(/^(?:[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/, {
        message: Mensajes_Error_Registro.MENSAJE_IDENTIFICADOR,
    }) 
    Correo_electronico: string;
    
    @ApiProperty({
        description: 'Contraseña entre 8 y 20 caracteres',
        example: 'MiC0ntraseñ@123',
        type: String,
        required: true,
    })
    @IsString()
    @MinLength(8)
    @MaxLength(20)
    @Transform(({ value }) => value.trim())
    Contraseña : string;

    @ApiProperty({
        description: 'Rol de la cuenta',
        type: String,
        required: false,
        example: 'ADMIN, SECRE, RF',
        default: 'ADMIN'
    })
    @IsString()
    @IsOptional()
    cuenta_rol: Roles;

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
