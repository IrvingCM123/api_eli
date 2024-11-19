import { Injectable, Logger } from '@nestjs/common';

import { CreateOrdenCompraDto, carritoCompras } from './dto/create-orden_compra.dto';
import { UpdateOrdenCompraDto } from './dto/update-orden_compra.dto';
import { CreateDetalleOrdenCompraDto, productoOC as CreateProductoDetalleOrdenCompraDto } from '../detalle_orden_compra/dto/create-detalle_orden_compra.dto';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { TransaccionService } from 'src/common/transaction/transaccion.service';
import { Tipo_Transaccion } from 'src/common/enums/tipo_Transaccion.enum';
import { User_Interface } from 'src/common/interfaces/user.interface';
import { validarAdmin, validarUsuario } from 'src/auth/guard/validateRole.guard';

import { OrdenCompra } from './entities/orden_compra.entity';
import { DetalleOrdenCompraService } from '../detalle_orden_compra/detalle_orden_compra.service';
import { InventarioService } from '../inventario/inventario.service';

import { DataSource } from 'typeorm';
import { DetalleOrdenCompra } from '../detalle_orden_compra/entities/detalle_orden_compra.entity';
import { ClientService } from 'src/client/client.service';
import { EstadoCompra } from 'src/common/enums/estado_Compra';

@Injectable()
export class OrdenCompraService {

  private readonly logger = new Logger('OrdenCompraService');

  constructor(
    private transaccionService: TransaccionService,
    private detalleOrdenCompraService: DetalleOrdenCompraService,
    private dataSource: DataSource,
    private clientService: ClientService,
    private inventarioService: InventarioService
  ) { }

  // Crea varias ordenes de compra a partir de un carrito de compras (array de ordenes de compra)
  async crear_varios(orden_compra: carritoCompras, user: User_Interface) {
    const validar = validarAdmin(user);

    if (validar !== true) { return { status: 500, mensaje: validar } }

    for (const orden of orden_compra.ordenes_compra) {
      await this.create(orden, user);
    }

    return { status: 201, mensaje: 'Orden de compra creada con éxito' };
  }

  async create(createOrdenCompraDto: CreateOrdenCompraDto, user: User_Interface) {
    const validar = validarAdmin(user);

    if (validar !== true) { return { status: 500, mensaje: validar } }

    const informacion_detalle_compra : CreateDetalleOrdenCompraDto = createOrdenCompraDto.detalle_orden_compra[0];
    
    let informacion_orden_compra: any = createOrdenCompraDto;
    delete informacion_orden_compra.detalle_orden_compra;
    informacion_orden_compra.orden_compra_fecha_ordenado = await this.obtenerFechaActual();
    
    const crear_detalle_compra = await this.detalleOrdenCompraService.create(informacion_detalle_compra);
    if (crear_detalle_compra.status === 500) { return { status: crear_detalle_compra.status, mensaje: crear_detalle_compra.mensaje } }
    informacion_orden_compra.detalle_orden_compra_ID = crear_detalle_compra.resultado;

    const crear_orden_compra = await this.transaccionService.transaction(Tipo_Transaccion.Guardar, OrdenCompra, informacion_orden_compra);

    if (crear_orden_compra.status === 500) {
      await this.transaccionService.transaction(Tipo_Transaccion.Eliminar_Con_Parametros, DetalleOrdenCompra, '', 'detalleOC_ID', crear_detalle_compra.resultado.detalleOC_ID.toString());
      return { status: 500, mensaje: 'Error al crear la orden de compra' }
    }

    await this.enviarCorreo(informacion_detalle_compra);

    return { status: 201, mensaje: 'Orden de compra creada con éxito' };
  }

  async findAll(user: User_Interface) {

    const validar = validarUsuario(user);

    if (validar !== true) { return { status: 500, mensaje: validar } }

    const orden = await this.dataSource
      .getRepository(OrdenCompra)
      .createQueryBuilder('orden_compra')
      .leftJoinAndSelect('orden_compra.detalle_orden_compra_ID', 'detalle_orden_compra')
      .leftJoinAndSelect('detalle_orden_compra.detalleOC_ProductoOC_ID', 'producto')
      .leftJoinAndSelect('detalle_orden_compra.detalleOC_Proveedor_ID', 'proveedor')
      .leftJoinAndSelect('detalle_orden_compra.detalleOC_Cuenta_ID', 'cuenta')
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
      .leftJoinAndSelect('producto.productoOC_Producto_ID', 'producto_id')
      .leftJoinAndSelect('detalle_orden_compra.detalleOC_Proveedor_ID', 'proveedor')
      .leftJoinAndSelect('detalle_orden_compra.detalleOC_Cuenta_ID', 'cuenta')
      .where('orden_compra.orden_compra_ID = :id', { id: id })
      .getOne();

    return orden;
  }

  async update(id: number, updateOrdenCompraDto: UpdateOrdenCompraDto, user: User_Interface) {
    const validar = validarAdmin(user);

    if (validar !== true) { return { status: 500, mensaje: validar } }

    const buscar: any = await this.findOne(id, user);

    let informacion_detalle_compra: any = buscar;

    if (updateOrdenCompraDto.orden_compra_estado == EstadoCompra.ENTREGADO) {
      informacion_detalle_compra.orden_compra_fecha_entregado = await this.obtenerFechaActual();
      informacion_detalle_compra.orden_compra_estado = EstadoCompra.ENTREGADO;

       for (const producto of informacion_detalle_compra.detalle_orden_compra_ID.detalleOC_ProductoOC_ID) {
        await this.inventarioService.actualizarInventarioPrivate(producto.productoOC_Producto_ID.producto_ID, producto.productoOC_Cantidad_Producto);
       }
    }

    const actualizar_orden_compra = await this.transaccionService.transaction(Tipo_Transaccion.Actualizar_Con_Parametros, OrdenCompra, updateOrdenCompraDto.orden_compra_estado, 'orden_compra_estado', id.toString());

    if (actualizar_orden_compra.status === 500) { return { status: 500, mensaje: 'Error al actualizar la orden de compra' } }

    return { status: 201, mensaje: 'Orden de compra actualizada con éxito' };

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

  async obtenerFechaActual() {
    const now = new Date();
    const offset = -6;
    const localDate = new Date(now.getTime() + (offset * 60 * 60 * 1000));
    return localDate.toISOString();
  }

  async enviarCorreo(DatosCompra: any) {
    this.clientService.email_proveedor(await this.obtenerFechaActual(), DatosCompra.detalleOC_Proveedor_ID.proveedor_Email, DatosCompra.detalleOC_Proveedor_ID.proveedor_Nombre, DatosCompra.detalleOC_ProductoOC_ID, 'Solicitud de orden de compra');
  }


}
