import { Injectable, Logger } from '@nestjs/common';
import { CreateDetalleVentaDto } from './dto/create-detalle_venta.dto';
import { UpdateDetalleVentaDto } from './dto/update-detalle_venta.dto';
import { TransaccionService } from 'src/common/transaction/transaccion.service';
import { Tipo_Transaccion } from 'src/common/enums/tipo_Transaccion.enum';
import { DetalleVenta } from './entities/detalle_venta.entity';
import { Cuenta } from '../cuentas/entities/cuenta.entity';
import { ProductoVenta } from './entities/detalle_venta.entity';
import { InventarioService } from '../inventario/inventario.service';
import { DataSource } from 'typeorm';

@Injectable()
export class DetalleVentaService {

  constructor(
    private transaccionService: TransaccionService,
    private inventarioService: InventarioService,
    private dataSource: DataSource
  ) { }

  async create(createDetalleVentaDto: CreateDetalleVentaDto) {
    let id_productos_venta = [];

    for (const productos of createDetalleVentaDto.producto_ID) {
      const producto_venta = new ProductoVenta();
      producto_venta.productoVenta_ProductoID = productos.productoVenta_ProductoID;
      producto_venta.productoVenta_CantidadProducto = productos.productoVenta_CantidadProducto;
      producto_venta.productoVenta_PrecioProducto = productos.productoVenta_PrecioProducto,
      producto_venta.productoVenta_SubtotalVenta = productos.productoVenta_SubtotalVenta,
      producto_venta.productoVenta_NombreProducto = productos.productoVenta_NombreProducto;
      
      const realizar_producto_venta = await this.transaccionService.transaction(Tipo_Transaccion.Guardar, ProductoVenta, producto_venta);
      //const eliminar_Inventario = await this.eliminar_Productos_Inventario(productos.productoVenta_ProductoID, productos.productoVenta_CantidadProducto);
      //if (eliminar_Inventario.status === 500) { return { status: eliminar_Inventario.status, mensaje: eliminar_Inventario.mensaje } }
      id_productos_venta.push(realizar_producto_venta.resultado);
      if (realizar_producto_venta.status === 500) { return { status: 500, mensaje: 'Error al crear el producto de la venta' } }
    }
    let detalleVenta = new DetalleVenta();
    
    detalleVenta.detalleVenta_TotalProductosVendidos = createDetalleVentaDto.detalleVenta_TotalProductosVendidos;
    detalleVenta.detalleVenta_MontoTotal = createDetalleVentaDto.detalleVenta_MontoTotal;
    detalleVenta.detalleVentaCorreoCliente = createDetalleVentaDto.detalleVentaCorreoCliente;
    detalleVenta.detalleVentaNombreCliente = createDetalleVentaDto.detalleVentaNombreCliente;
    detalleVenta.cuenta_ID = await this.obtenerCuenta(createDetalleVentaDto.cuenta_ID);
    detalleVenta.detalleVenta_ProductoVenta_ID = id_productos_venta;
    const detalle_venta = await this.transaccionService.transaction(Tipo_Transaccion.Guardar, DetalleVenta, detalleVenta);
    if (detalle_venta.status === 500) { return { status: 500, mensaje: 'Error al crear el detalle de la venta' } }
    return { status: 201, mensaje: 'Detalle de la venta creado con éxito', resultado: detalle_venta.resultado }
  }

  async obtenerCuenta(cuentaID: number): Promise<any> {
    // Realizar búsqueda de la cuenta utilizando el servicio de transacción, usando el ID de la cuenta como parámetro
    const cuenta: any = await this.transaccionService.transaction(Tipo_Transaccion.Consultar_Con_Parametros, Cuenta, '', 'cuenta_ID', cuentaID);
    // Si la cuenta no existe, retornar un mensaje de error
    if (cuenta.status === 500 || cuenta.resultado.length == 0 || cuenta == undefined) { return { status: 500, mensaje: `Cuenta no encontrada` }; }
    // Crear un arreglo para almacenar la cuenta completa
    let cuenta_completa = [];
    // Agregar la cuenta a la cuenta completa
    cuenta_completa.push(cuenta.resultado[0]);
    // Retornar la cuenta completa
    return cuenta_completa;
  }

  async eliminar_Productos_Inventario(id_producto: number | string, cantidad_eliminar: number) {
    const resultado = await this.inventarioService.eliminarInventarioPrivate(id_producto, cantidad_eliminar);
    return resultado;
  }

  async findAll() {

    const detalleVenta = await this.dataSource
    .getRepository(DetalleVenta)
    .createQueryBuilder('DetalleVenta')
    .leftJoin('DetalleVenta.cuenta_ID', 'Cuenta')
    .leftJoin('DetalleVenta.detalleVenta_ProductoVenta_ID', 'ProductoVenta')
    .select([
      'DetalleVenta.detalleVenta_ID',
      'DetalleVenta.detalleVenta_TotalProductosVendidos',
      'DetalleVenta.detalleVenta_MontoTotal',
      'DetalleVenta.detalleVentaCorreoCliente',
      'DetalleVenta.detalleVentaNombreCliente',
      'Cuenta.cuenta_Nombre',
      'Cuenta.cuenta_Apellido',
      'Cuenta.cuenta_Correo',
      'ProductoVenta.productoVenta_CantidadProducto',
      'ProductoVenta.productoVenta_PrecioProducto',
      'ProductoVenta.productoVenta_SubtotalVenta',
      'ProductoVenta.productoVenta_NombreProducto'
    ])
    .getMany();

    return detalleVenta;
  }

  async findOne(id: number) {

    const detalle_venta = await this.transaccionService.transaction(Tipo_Transaccion.Consultar_Con_Parametros, DetalleVenta, '', 'detalleVenta_ID', id.toString());

    return detalle_venta;

  }

  async update(id: number, updateDetalleVentaDto: UpdateDetalleVentaDto) {

    const detalle_venta = await this.transaccionService.transaction(Tipo_Transaccion.Actualizar_Con_Parametros, DetalleVenta, updateDetalleVentaDto, 'detalleVenta_ID', id.toString());

    if (detalle_venta.status === 500) { return { status: 500, mensaje: 'Error al actualizar el detalle de la venta' } }

    return { status: 200, mensaje: 'Detalle de la venta actualizado con éxito' };

  }

  async remove(id: number) {

    const detalle_venta = await this.transaccionService.transaction(Tipo_Transaccion.Eliminar_Con_Parametros, DetalleVenta, '', 'detalleVenta_ID', id.toString());

    if (detalle_venta.status === 500) { return { status: 500, mensaje: 'Error al eliminar el detalle de la venta' } }

    return { status: 200, mensaje: 'Detalle de la venta eliminado con éxito' };

  }
}
