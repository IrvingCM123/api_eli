import { Injectable, Logger } from '@nestjs/common';
import { CreateProveedoreDto } from './dto/create-proveedore.dto';
import { UpdateProveedoreDto } from './dto/update-proveedore.dto';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { TransaccionService } from 'src/common/transaction/transaccion.service';
import { Tipo_Transaccion } from 'src/common/enums/tipo_Transaccion.enum';
import { User_Interface } from 'src/common/interfaces/user.interface';
import { ProveedorBanco, Proveedore } from './entities/proveedore.entity';

import { validarAdmin, validarSecretaria, validarUsuario } from 'src/auth/guard/validateRole.guard';
import { Transaccion_Bancaria } from 'src/common/enums/transaccion_bancaria.enum';

@Injectable()
export class ProveedoresService {

  constructor(
    @InjectRepository(Proveedore)
    private proveedoreRepository: Repository<Proveedore>,
    private transaccionService: TransaccionService,
  ) {}

  async create(createProveedoreDto: CreateProveedoreDto, user: User_Interface) {

    const validar = validarAdmin(user);

    if (validar !== true) { return { status: 500, mensaje: validar } }

    let proveedor = {
      proveedor_Nombre: createProveedoreDto.proveedor_Nombre,
      proveedor_Direccion: createProveedoreDto.proveedor_Direccion,
      proveedor_Telefono: createProveedoreDto.proveedor_Telefono,
      proveedor_Email: createProveedoreDto.proveedor_Email,
      proveedor_Catalogo: createProveedoreDto.proveedor_Catalogo,
      proveedor_FechaCreacion: new Date(),
      proveedorBanco_ID: null
    }

    const buscar_proveedor = await this.findOne(proveedor.proveedor_Nombre, user);

    if (buscar_proveedor.length > 0) { return { status: 500, mensaje: 'El proveedor ya existe' } }
    
    const cuentaBancaria = await this.crearInformacionBancaria( createProveedoreDto.proveedorBanco_CuentaBancaria, createProveedoreDto.proveedorBanco_NombreBanco, createProveedoreDto.proveedorBanco_NombreBeneficiario, createProveedoreDto.proveedorBanco_TipoTransaccion );
    proveedor.proveedorBanco_ID = cuentaBancaria;

    const crear_proveedor = await this.transaccionService.transaction( Tipo_Transaccion.Guardar, Proveedore, proveedor )
    if (crear_proveedor.status === 500) { return { status: 500, mensaje: 'Error al crear el proveedor' } }

    return { status: 201, mensaje: 'Proveedor creado con éxito' }
  }

  async crearInformacionBancaria(cuentaBancaria: number, nombreBanco: string, nombreBeneficiario: string, tipoTransaccion: Transaccion_Bancaria) {

    const proveedor_banco = { proveedorBanco_CuentaBancaria: cuentaBancaria, proveedorBanco_NombreBanco: nombreBanco, proveedorBanco_NombreBeneficiario: nombreBeneficiario, proveedorBanco_TipoTransaccion: tipoTransaccion }

    const crear_proveedor_banco = await this.transaccionService.transaction(Tipo_Transaccion.Guardar, ProveedorBanco, proveedor_banco)

    if (crear_proveedor_banco.status === 500) { return { status: 500, mensaje: 'Error al crear la información bancaria' } }

    return crear_proveedor_banco.resultado.proveedorBanco_ID;

  }

  async findAll(user: User_Interface) {

    const validar = validarUsuario(user);

    if (validar !== true) { return { status: 500, mensaje: validar } }

    const proveedores = await this.transaccionService.transaction( Tipo_Transaccion.Consultar, Proveedore, '' )

    return proveedores;
  }

  async findOne(nombre: string, user: User_Interface) {
    
    const validar = validarUsuario(user);

    if (validar !== true) { return { status: 500, mensaje: validar } }

    const proveedor = await this.transaccionService.transaction( Tipo_Transaccion.Consultar_Con_Parametros, Proveedore, '' , 'proveedor_Nombre', nombre )

    return proveedor.resultado;
  }

  async update(id: number, updateProveedoreDto: UpdateProveedoreDto, user: User_Interface) {
    const validar = validarAdmin(user);
    if (validar !== true) { return { status: 500, mensaje: validar } }
    const proveedorBanco = { ...updateProveedoreDto.proveedorBanco_ID }
    await this.transaccionService.transaction( Tipo_Transaccion.Actualizar, ProveedorBanco, proveedorBanco, 'proveedorBanco_ID', proveedorBanco.proveedorBanco_ID.toString() )
    const proveedor = {...updateProveedoreDto, proveedor_FechaCreacion: new Date()  }
    const actualizar_proveedor = await this.transaccionService.transaction( Tipo_Transaccion.Actualizar, Proveedore, proveedor, 'proveedor_ID', id.toString() )
    if (actualizar_proveedor.status == 500) { return { status: 500, mensaje: 'Error al actualizar el proveedor' } }
    return { status: 201, mensaje: 'Proveedor actualizado con éxito' }
  }

  async remove(id: number, user: User_Interface) {
    
    const validar = validarAdmin(user);

    if (validar !== true) { return { status: 500, mensaje: validar } }

    const eliminar = await this.transaccionService.transaction(Tipo_Transaccion.Eliminar_Con_Parametros, Proveedore, '', 'proveedor_ID', id.toString() )

    if (eliminar.status === 500) { return { status: 500, mensaje: 'Error al eliminar el proveedor' } }

    return { status: 201, mensaje: 'Proveedor eliminado con éxito'};

  }
}
