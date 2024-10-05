import { Injectable, Logger } from '@nestjs/common';
import { CreateCuentaDto } from './dto/create-cuenta.dto';
import { UpdateCuentaDto } from './dto/update-cuenta.dto';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { TransaccionService } from 'src/common/transaction/transaccion.service';
import { Tipo_Transaccion } from 'src/common/enums/tipo_Transaccion.enum';
import { Estado } from 'src/common/enums/cuentas.enum';
import * as bcrypt from 'bcrypt';
import { User_Interface } from 'src/common/interfaces/user.interface';
import { validarAdmin } from 'src/auth/guard/validateRole.guard';

import { Cuenta } from './entities/cuenta.entity';
import {
  Mensajes_Errores_Cuentas,
  Mensajes_Exito_Cuentas,
} from 'src/common/helpers/cuentas.helpers';

@Injectable()
export class CuentasService {

  private readonly logger = new Logger('TrabajadoresService');

  constructor(
    @InjectRepository(Cuenta)
    private cuentaRepository: Repository<Cuenta>,
    private transaccionService: TransaccionService,
  ) {}

  create(createCuentaDto: CreateCuentaDto) {
    return 'This action adds a new cuenta';
  }

  findAll() {
    return this.cuentaRepository.find();
  }

  async findOne(correo: string) {

    const nuevoCorreo = correo.toLowerCase();

    const buscar_cuenta = await this.transaccionService.transaction( Tipo_Transaccion.Consultar_Con_Parametros, Cuenta, '', 'cuenta_Correo', nuevoCorreo );

    if (buscar_cuenta.status === 201 && buscar_cuenta.resultado.length > 0) {

      return {
        cuenta: buscar_cuenta.resultado[0],
        status: 201,
        mensaje: Mensajes_Errores_Cuentas.CUENTA_EXISTENTE,
      };
    } else {
      return {
        mensaje: Mensajes_Errores_Cuentas.CUENTA_NO_ENCONTRADA,
        status: 500,
      };
    }
  }

  async update(correo: string, updateCuentaDto: UpdateCuentaDto, user: User_Interface) {

    const validar = validarAdmin(user);

    if (validar !== true) {
      return {
        mensaje: validar,
        status: 500,
      };
    }

    try {
      const actualizar_cuenta = await this.transaccionService.transaction(Tipo_Transaccion.Actualizar_Con_Parametros, Cuenta, updateCuentaDto, 'cuenta_Correo', correo, );

      if (actualizar_cuenta.status === 201) {
        return {
          mensaje: Mensajes_Exito_Cuentas.CUENTA_ACTUALIZADA,
          status: actualizar_cuenta.status,
        };
      } else {
        return {
          mensaje: Mensajes_Errores_Cuentas.CUENTA_NO_ACTUALIZADA,
          status: actualizar_cuenta.status,
        };
      }
    } catch (error) {
      return {
        mensaje: Mensajes_Errores_Cuentas.CUENTA_NO_ACTUALIZADA,
        status: 500,
      };
    }
  }

  async actualizarEstadoCuenta(correo: string, estado_cuenta: any, user: User_Interface) {

    const validar = validarAdmin(user);

    if (validar !== true) { return { mensaje: validar, status: 500, }; }

    const buscar_cuenta = await this.transaccionService.transaction( Tipo_Transaccion.Consultar_Con_Parametros, Cuenta, '', 'cuenta_Correo', correo, );

    if (buscar_cuenta.status == 500 ) {
      return {
        status: buscar_cuenta.status,
        message: Mensajes_Errores_Cuentas.CUENTA_NO_ENCONTRADA
      }
    }

    const cuenta_ID = buscar_cuenta.resultado.cuenta_ID;

    let resultato = await this.transaccionService.transaction(Tipo_Transaccion.Actualizar_Con_Parametros, Cuenta, estado_cuenta, 'cuenta_Estado_Cuenta', cuenta_ID);

    if (resultato.status == 201) {
      return {
        status: resultato.status,
        message: Mensajes_Exito_Cuentas.CUENTA_ACTUALIZADA
      }
    } else {
      return {
        status: resultato.status,
        message: Mensajes_Errores_Cuentas.CUENTA_NO_ACTUALIZADA
      }
    }
  }

  async actualizarContraseña(correo: string, contraseña: string, user: User_Interface) {

    const validar = validarAdmin(user);

    if (validar !== true) { return { mensaje: validar, status: 500 }; }


    const buscar_cuenta = await this.transaccionService.transaction( Tipo_Transaccion.Consultar_Con_Parametros, Cuenta, '', 'cuenta_Correo', correo, );

    if (buscar_cuenta.status == 500 ) { return { status: buscar_cuenta.status, message: Mensajes_Errores_Cuentas.CUENTA_NO_ENCONTRADA } }

    const cuenta_ID = buscar_cuenta.resultado.cuenta_ID;

    const hashedPassword = await bcrypt.hash(contraseña, 10);

    let resultado = await this.transaccionService.transaction(Tipo_Transaccion.Actualizar_Con_Parametros, Cuenta, hashedPassword, 'cuenta_Contrasena', cuenta_ID);

    if (resultado.status == 201) {
      return {
        status: resultado.status,
        message: Mensajes_Exito_Cuentas.CONTRASEÑA_ACTUALIZADA
      }
    } else {
      return {
        status: resultado.status,
        message: Mensajes_Errores_Cuentas.CONTRASEÑA_NO_ACTUALIZADA

      }
    }
  }

  async remove(correo: string, user: User_Interface) {
    
    const validar = validarAdmin(user);

    if (validar !== true) {
      return {
        mensaje: validar,
        status: 500,
      };
    }

    const buscar_cuenta = await this.transaccionService.transaction(
      Tipo_Transaccion.Consultar_Con_Parametros,
      Cuenta,
      '',
      'cuenta_Correo',
      correo,
    );

    if (buscar_cuenta.status == 500 ) {  return {  status: buscar_cuenta.status, message: Mensajes_Errores_Cuentas.CUENTA_NO_ENCONTRADA  } }

    const cuenta_ID = buscar_cuenta.resultado.cuenta_ID;

    let resultado = await this.transaccionService.transaction(Tipo_Transaccion.Actualizar_Con_Parametros, Cuenta, Estado.ELIMINADO, 'cuenta_Estado_Cuenta', cuenta_ID);

    if (resultado.status == 201) {
      return {
        status: resultado.status,
        message: Mensajes_Exito_Cuentas.CUENTA_ELIMINADA
      }
    } else {
      return {
        status: resultado.status,
        message: Mensajes_Errores_Cuentas.CUENTA_NO_ELIMINADA
      }
    }
  }
}
