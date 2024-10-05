import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { jwtConstants } from 'src/common/constants/jwt.constant';
import { Errores_TOKEN } from 'src/common/helpers/Token.helper';

// El método extrae el token de la petición, validando que lo contenga, si no lo contiene o está mal formado, se asigna un error a la petición. Si todo está correcto, se verifica el token y se asigna el payload a la petición.
@Injectable()
export class AuthGuard implements CanActivate {

    constructor(private jwtService: JwtService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {

        // Obtener la solicitud HTTP del contexto de ejecución
        const request: any = context.switchToHttp().getRequest();
        // Extraer el token de la solicitud HTTP
        const token = this.extractToken(request);

        if (!token) {
            // Asignar el error a la solicitud si no se encuentra el token
            request.authError = Errores_TOKEN.TOKEN_AUTENTICACION_NO_ENCONTRADO;
            return false;
        }

        try {

            // Verificar el token y obtener el payload
            const payload = await this.jwtService.verifyAsync(token, {
                secret: jwtConstants.secret,
            });

            // Asignar el usuario decodificado a la solicitud
            request.user = payload;

            // También puedes asignar directamente el ID de la cuenta si está presente en el payload
            request.accountId = payload.accountId;

            return true;
        } catch (error) {
            // Capturar cualquier error y asignarlo a la solicitud
            request.authError = Errores_TOKEN.TOKEN_AUTENTICACION_INVALIDO
            return false;
        }

    }

    private extractToken(request: Request): string | undefined {

        // Obtener el encabezado de autorización
        const authHeader = request.headers.authorization;

        // Verificar si el encabezado de autorización está presente
        if (!authHeader) {
            return Errores_TOKEN.TOKEN_AUTENTICACION_NO_ENCONTRADO;
        }

        // Verificar si el encabezado de autorización tiene el formato correcto (Bearer token)
        const parts = authHeader.split(' ');

        // Verificar si el encabezado de autorización tiene dos partes
        if (parts.length !== 2) {
            return Errores_TOKEN.TOKEN_AUTENTICACION_MALFORMADO;
        }

        // Verificar si la primera parte del encabezado de autorización es Bearer
        const [scheme, token] = parts;

        // Verificar si la primera parte del encabezado de autorización es Bearer
        if (!/^Bearer$/i.test(scheme)) {
            return Errores_TOKEN.TOKEN_AUTENTICACION_MALFORMADO;
        }

        // Devolver el token
        return token;
    }
}
