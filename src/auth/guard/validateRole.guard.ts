import { Roles as Rol } from 'src/common/enums/roles.enum';
import { Mensajes_Errores_Roles } from 'src/common/helpers/roles.helpers';
import { User_Interface } from 'src/common/interfaces/user.interface';

// Estas funciones validan el rol de un usuario, asegurandose que sea un rol válido y autorizado.

export function validarAdmin(user: User_Interface) {
  if (user.role === Rol.ADMIN) {
    return true;
  } else {
    return Mensajes_Errores_Roles.ROL_NO_AUTORIZADO;
  }
}

export function validarSecretaria(user: User_Interface) {
  if (user.role === Rol.SECRE) {
    return true;
  } else {
    return Mensajes_Errores_Roles.ROL_NO_AUTORIZADO;
  }
}

export function validarResponsableFinanzas(user: User_Interface) {
  if (user.role === Rol.RF) {
    return true;
  } else {
    return Mensajes_Errores_Roles.ROL_NO_AUTORIZADO;
  }
}

export function validarUsuario(user: User_Interface) {
  if (user.role === Rol.ADMIN || user.role === Rol.SECRE || user.role === Rol.RF) {
    return true;
  } else {
    return Mensajes_Errores_Roles.ROL_NO_AUTORIZADO;
  }
}
