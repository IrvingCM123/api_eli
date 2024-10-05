import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core'; 
import { Roles } from 'src/common/enums/roles.enum';
import { Roles_Key } from '../decorators/roles.decorator';
import { Mensajes_Errores_Roles } from 'src/common/helpers/roles.helpers';

/**
 * Guardia de autenticación que valida los roles de usuario.
 */
@Injectable()
export class RoleGuard implements CanActivate {

  constructor(private readonly reflector: Reflector) {} // Inyecta el servicio Reflector para acceder a los metadatos de los controladores y los métodos

  /**
   * Método que implementa la lógica de la guardia de autenticación.
   * @param context Contexto de ejecución de la solicitud.
   * @returns True si el usuario tiene los roles requeridos, de lo contrario lanza una excepción.
   */
  async canActivate(context: ExecutionContext): Promise<boolean> {

    let validar = false;

    // Obtener los roles requeridos del decorador Roles_Key definido en el controlador o método
    const roles = await this.reflector.getAllAndOverride<Roles>(Roles_Key, [
      context.getHandler(),
      context.getClass(),
    ]);

    // Obtener la solicitud HTTP del contexto de ejecución
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      // Si no hay usuario en la solicitud, retornar string 
      request.authError = Mensajes_Errores_Roles.ROL_NO_ENCONTRADO;
      return false;
    }
    
    // Iterar sobre los valores del enum Roles
    const valoresEnum = Object.values(Roles);
    for (let valor of valoresEnum) {
      if (user.role === valor) {
        return (validar = true);
      } else {
        validar = false;
      }
    }

    if (validar === false) {
      request.authError = Mensajes_Errores_Roles.ROL_INVALIDO;
      return false;
    }

    return roles === user.role; // Devuelve true si los roles requeridos coinciden con el rol del usuario
  }
}
