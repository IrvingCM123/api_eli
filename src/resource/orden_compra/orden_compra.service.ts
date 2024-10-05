import { Injectable, Logger } from '@nestjs/common';
import { CreateOrdenCompraDto } from './dto/create-orden_compra.dto';
import { UpdateOrdenCompraDto } from './dto/update-orden_compra.dto';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { TransaccionService } from 'src/common/transaction/transaccion.service';
import { Tipo_Transaccion } from 'src/common/enums/tipo_Transaccion.enum';
import { User_Interface } from 'src/common/interfaces/user.interface';
import { validarAdmin, validarUsuario } from 'src/auth/guard/validateRole.guard';

import { OrdenCompra } from './entities/orden_compra.entity';
import { CreateDetalleOrdenCompraDto } from '../detalle_orden_compra/dto/create-detalle_orden_compra.dto';
import { DetalleOrdenCompraService } from '../detalle_orden_compra/detalle_orden_compra.service';

import { DataSource } from 'typeorm';
import { DetalleOrdenCompra } from '../detalle_orden_compra/entities/detalle_orden_compra.entity';

@Injectable()
export class OrdenCompraService {

  private readonly logger = new Logger('OrdenCompraService');

  constructor(
    private transaccionService: TransaccionService,
    private detalleOrdenCompraService: DetalleOrdenCompraService,
    private dataSource: DataSource,
  ) { }

  async crear_varios(orden_compra: CreateOrdenCompraDto[], user: User_Interface) {

    const validar = validarAdmin(user);

    if (validar !== true) { return { status: 500, mensaje: validar } }

    for (const orden of orden_compra) {

      await this.create(orden, user);

    }
  }

  async create(createOrdenCompraDto: CreateOrdenCompraDto, user: User_Interface) {

    const validar = validarAdmin(user);

    if (validar !== true) { return { status: 500, mensaje: validar } }

    const informacion_detalle_compra: CreateDetalleOrdenCompraDto = {
      detalleOC_Cantidad_Producto: createOrdenCompraDto.detalleOC_Cantidad_Producto,
      detalleOC_MontoTotal: createOrdenCompraDto.detalleOC_MontoTotal,
      detalleOC_Proveedor_ID: createOrdenCompraDto.detalleOC_Proveedor_ID,
      detalleOC_Cuenta_ID: createOrdenCompraDto.detalleOC_Cuenta_ID,
      detalleOC_ProductoOC: createOrdenCompraDto.detalleOC_ProductoOC,
      
    }

    console.log(informacion_detalle_compra, 'informacion_detalle_compra');

    const crear_detalle_compra = await this.detalleOrdenCompraService.create(informacion_detalle_compra);
    console.log(crear_detalle_compra, 'crear_detalle_compra');
    //if (crear_detalle_compra.status === 500) { return { status: crear_detalle_compra.status, mensaje: crear_detalle_compra.mensaje } }
//
    //const informacion_orden_compra = {
    //  orden_compra_estado: createOrdenCompraDto.orden_compra_estado,
    //  orden_compra_fecha_ordenado: new Date(),
    //  orden_compra_fecha_entregado: createOrdenCompraDto.orden_compra_fecha_entregado,
    //  detalle_orden_compra_ID: crear_detalle_compra.resultado.detalle_orden_compra_ID
    //}
//
    //const crear_orden_compra = await this.transaccionService.transaction(Tipo_Transaccion.Guardar, OrdenCompra, informacion_orden_compra);
//
    //if (crear_orden_compra.status === 500) {
    //  await this.transaccionService.transaction(Tipo_Transaccion.Eliminar_Con_Parametros, DetalleOrdenCompra, '', 'detalleOC_ID', crear_detalle_compra.resultado.detalleOC_ID.toString());
    //  return { status: 500, mensaje: 'Error al crear la orden de compra' }
    //}
//
    //return { status: 201, mensaje: 'Orden de compra creada con éxito' };
    return 0;
  }

  async findAll(user: User_Interface) {

    const validar = validarUsuario(user);

    if (validar !== true) { return { status: 500, mensaje: validar } }

    const orden = await this.dataSource
      .getRepository(OrdenCompra)
      .createQueryBuilder('orden_compra')
      .leftJoinAndSelect('orden_compra.detalle_orden_compra_ID', 'detalle_orden_compra')
      .leftJoinAndSelect('detalle_orden_compra.detalleOC_ProductoOC_ID', 'producto')
      .leftJoinAndSelect('detalle_orden_compra.detalleOC_ProveedorID', 'proveedor')
      .leftJoinAndSelect('detalle_orden_compra.detalleOC_CuentaID', 'cuenta')
      .getMany();

    return orden;
  }

  async findOne(id: number, user: User_Interface) {

    const validar = validarUsuario(user);

    if (validar !== true) { return { status: 500, mensaje: validar } }

    const orden = await this.dataSource
      .getRepository(OrdenCompra)
      .createQueryBuilder('orden_compra')
      .leftJoinAndSelect('orden_compra.detalle_orden_compra_ID', 'detalle_orden_compra')
      .leftJoinAndSelect('detalle_orden_compra.detalleOC_ProductoOC_ID', 'producto')
      .leftJoinAndSelect('detalle_orden_compra.detalleOC_ProveedorID', 'proveedor')
      .leftJoinAndSelect('detalle_orden_compra.detalleOC_CuentaID', 'cuenta')
      .where('orden_compra.orden_compra_ID = :id', { id: id })
      .getOne();

    return orden;
  }

  async update(id: number, updateOrdenCompraDto: UpdateOrdenCompraDto, user: User_Interface) {

    const validar = validarAdmin(user);

    if (validar !== true) { return { status: 500, mensaje: validar } }

    const buscar = await this.findOne(id, user);

    const informacion_detalle_compra = {
      ...buscar,
      orden_compra_estado: updateOrdenCompraDto.orden_compra_estado,
      orden_compra_fecha_ordenado: updateOrdenCompraDto.orden_compra_fecha_ordenado,
      orden_compra_fecha_entregado: updateOrdenCompraDto.orden_compra_fecha_entregado,
    }

    const actualizar_orden_compra = await this.transaccionService.transaction(Tipo_Transaccion.Actualizar, OrdenCompra, informacion_detalle_compra, '', id.toString());

    if (actualizar_orden_compra.status === 500) { return { status: 500, mensaje: 'Error al actualizar la orden de compra' } }

    return { status: 200, mensaje: 'Orden de compra actualizada con éxito' };

  }

  async remove(id: number, user: User_Interface) {

    const validar = validarAdmin(user);

    if (validar !== true) { return { status: 500, mensaje: validar } }

    const buscar: any = await this.findOne(id, user);

    const eliminar_detalle = await this.transaccionService.transaction(Tipo_Transaccion.Eliminar_Con_Parametros, DetalleOrdenCompra, '', 'detalleOC_ID', buscar.detalle_orden_compra_ID.detalle_orden_compra_ID.toString());
    const eliminar = await this.transaccionService.transaction(Tipo_Transaccion.Eliminar_Con_Parametros, OrdenCompra, '', 'orden_compra_ID', id.toString());

    if (eliminar.status === 500) { return { status: 500, mensaje: 'Error al eliminar la orden de compra' } }

    return { status: 200, mensaje: 'Orden de compra eliminada con éxito' };
  }

}
