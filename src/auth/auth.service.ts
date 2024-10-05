import { Injectable } from '@nestjs/common';

import { LoginDto } from 'src/auth/dto/login.dto'; // Es un molde o una forma en que se deben recibir los datos
import { RegisterDto } from 'src/auth/dto/registro.dto';

import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt'; 

import { Mensajes_Error_Registro, Mensaje_Exito_Registro } from 'src/common/helpers/registro.helpers';
import { Mensajes_Error_Usuario, Mensaje_Exito_USUARIO } from 'src/common/helpers/usuario.helpers';

// return 'Error en el servidor, intente más tarde';
import { Cuenta } from 'src/resource/cuentas/entities/cuenta.entity';
import { CuentasService } from 'src/resource/cuentas/cuentas.service';
import { Estado_Logico } from 'src/common/enums/estado_logico.enum';
import { TransaccionService } from 'src/common/transaction/transaccion.service';

import { interfaz_Registro_Cuenta } from 'src/common/interfaces/login.interface';
import { Tipo_Transaccion } from 'src/common/enums/tipo_Transaccion.enum';
import { Mensajes_Errores_Cuentas } from 'src/common/helpers/cuentas.helpers';

@Injectable()
export class AuthService {

  constructor( // Reutilizar codigo
    private cuentasService: CuentasService,
    private jwtService: JwtService, // Generar token de acceso al sistema
    private transaccionService: TransaccionService,
  ) { }

  // Registro de usuario
  async register(registroDTO: RegisterDto) {
    
    const buscar_cuenta = await this.cuentasService.findOne(registroDTO.Correo_electronico); // Conocer si la cuenta ya existe

    if (buscar_cuenta.status === 201) { // Si retorna un 201, la cuenta ya existe
      return { status: 500, mensaje: buscar_cuenta.mensaje }; 
    }

    const contraseña_cifrada = await bcrypt.hash(registroDTO.Contraseña, 10); // Cifrar la contraseña
    const fecha_creacion = new Date(); // Fecha de creación de la cuenta

    const nuevoCorreo = registroDTO.Correo_electronico.toLowerCase(); // Convertir el correo a minúsculas
    // IrvingConde@Gmail.com    irvingconde@gmail.com   IRVINGCONDE@GMAIL.COM
    
    // Creacion de nuevo objeto de cuenta con los datos actualizados para su almacenamiento
    const cuenta: interfaz_Registro_Cuenta = {
      cuenta_Correo: nuevoCorreo,
      cuenta_Contrasena: contraseña_cifrada,
      cuenta_Rol: registroDTO.cuenta_rol,
      cuenta_Estado_Cuenta: Estado_Logico.ACTIVO,
      cuenta_Fecha_Registro: fecha_creacion,
      cuenta_Nombre: registroDTO.Nombre,
      cuenta_Apellido: registroDTO.Apellidos
    }

    // Crear la cuenta con el servicio de transacción
    const crear_cuenta = await this.transaccionService.transaction( Tipo_Transaccion.Guardar, Cuenta, cuenta )

    if (crear_cuenta.status === 500) {
      return { status: 500, mensaje: Mensajes_Error_Registro.ERROR_INESPERADO };
    } else {
      return { status: 201, mensaje: Mensaje_Exito_Registro.MENSAJE };
    }

  }

  async login(loginDto: LoginDto) {

    const buscar_cuenta = await this.cuentasService.findOne(loginDto.Correo_electronico); // Buscamos la cuenta recibida por el dto

    if (buscar_cuenta.status == 500) {
      return { status: 500, mensaje: buscar_cuenta.mensaje }; 
    }

    const estado_cuenta = buscar_cuenta.cuenta.cuenta_Estado_Cuenta;

    if (estado_cuenta === Estado_Logico.ELIMINADO) {
      return { status: 500, mensaje: Mensajes_Errores_Cuentas.CUENTA_ELIMINADA };
    } else if (estado_cuenta === Estado_Logico.INACTIVO) {
      return { status: 500, mensaje: Mensajes_Errores_Cuentas.CUENTA_INACTIVA };
    }

    if (!(await bcrypt.compare(loginDto.Contraseña, buscar_cuenta.cuenta.cuenta_Contrasena))) {
      // Ciframos la contraseña recibida en este dto y la comparamos con la contraseña cifrada de la cuenta
      return { status: 500, mensaje: Mensajes_Errores_Cuentas.CONTRASEÑA_NO_VALIDA };
    }

    // El token generado o que se generará lleva consigo, o se le asigna, el correo y el rol del usuario
    const payload = { correo: buscar_cuenta.cuenta.cuenta_Correo, role: buscar_cuenta.cuenta.cuenta_Rol, ID: buscar_cuenta.cuenta.cuenta_ID };

    // Generamos el token de acceso al sistema
    const access_Token = await this.jwtService.signAsync(payload);

    return {
      status: 201,
      mensaje: Mensaje_Exito_USUARIO.Sesion_Activa,
      access_Token: access_Token
    }

  }

  obtenerCodigoAutorizacion() {
    return '05082002';
  }

}
