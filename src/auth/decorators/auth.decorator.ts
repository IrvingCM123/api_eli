import { applyDecorators, UseGuards } from '@nestjs/common';
import { Roles as Rol } from 'src/common/enums/roles.enum';
import { AuthGuard } from 'src/auth/guard/auth.guard';
import { RoleGuard } from 'src/auth/guard/role.guard'; 
import { Roles } from 'src/auth/decorators/roles.decorator';

// Esta función crea un decorador de autorización que toma un rol como argumento
export function Auth(roles: Rol) {
  // Aplica los decoradores 'Roles' y 'UseGuards' al decorador que se está creando
  return applyDecorators(Roles(roles), UseGuards(AuthGuard, RoleGuard));
}