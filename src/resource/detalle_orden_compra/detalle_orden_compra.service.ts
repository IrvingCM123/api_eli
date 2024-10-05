import { Injectable, Logger } from '@nestjs/common';

// Importa los DTO, para definir la estructura de los datos que se envían al crear o actualizar un detalle de orden de compra
import { CreateDetalleOrdenCompraDto, productoOC } from './dto/create-detalle_orden_compra.dto';
import { UpdateDetalleOrdenCompraDto } from './dto/update-detalle_orden_compra.dto';

// Importa el servicio TransaccionService para realizar transacciones con la base de datos
import { TransaccionService } from 'src/common/transaction/transaccion.service';
// Importa el enum Tipo_Transaccion para definir los tipos de transacciones que se pueden realizar
import { Tipo_Transaccion } from 'src/common/enums/tipo_Transaccion.enum';

// Importa las entidades necesarias para realizar las transacciones y sus relaciones 
import { OrdenCompra } from '../orden_compra/entities/orden_compra.entity';
import { Proveedore } from '../proveedores/entities/proveedore.entity';
import { Producto } from '../productos/entities/producto.entity';
import { DetalleOrdenCompra, ProductoOrdenCompra } from './entities/detalle_orden_compra.entity';
import { Cuenta } from '../cuentas/entities/cuenta.entity';

// Importar los errores de las operaciones para devolver los mensajes de error
import { Errores_Operaciones } from 'src/common/helpers/operaciones.helpers';

@Injectable()
export class DetalleOrdenCompraService {
  // Inyecta el servicio TransaccionService y el servicio InventarioService en el servicio DetalleOrdenCompraService
  constructor(
    private transaccionService: TransaccionService,
  ) { }

  // Método para crear un detalle de orden de compra
  async create(createDetalleOrdenCompraDto: CreateDetalleOrdenCompraDto) {

    const productos: any = await this.obtenerProducto(createDetalleOrdenCompraDto.detalleOC_ProductoOC);

    const productoOC: any = await this.crearProductoOrdenCompra(productos)
    const cuenta: any = await this.obtenerCuenta(createDetalleOrdenCompraDto.detalleOC_Cuenta_ID);
    const proveedor: any = await this.obtenerProveedores(createDetalleOrdenCompraDto.detalleOC_Proveedor_ID);

    const objetoDetalleOrdenCompra = {
      detalleOC_Cantidad_Producto: createDetalleOrdenCompraDto.detalleOC_Cantidad_Producto,
      detalleOC_MontoTotal: createDetalleOrdenCompraDto.detalleOC_MontoTotal,
      detalleOC_Proveedor_ID: proveedor,
      detalleOC_Cuenta_ID: cuenta,
      detalleOC_ProductoOC_ID: productoOC
    }
    console.log(objetoDetalleOrdenCompra, 'objetoDetalleOrdenCompra');

    const detalle_orden_compra = await this.transaccionService.transaction( Tipo_Transaccion.Guardar, DetalleOrdenCompra, objetoDetalleOrdenCompra );
    
    console.log(detalle_orden_compra, 'detalle_orden_compra');
    if (detalle_orden_compra.status === 500) { return { status: 500, mensaje: Errores_Operaciones.EROR_CREAR }; }

    return { status: 201, resultado: detalle_orden_compra.resultado };
  }

  async crearProductoOrdenCompra(crearProductoOC: productoOC[]) {
    let productosOC: ProductoOrdenCompra[] = [];
    for ( let producto of crearProductoOC ) {
      const productoOC = await this.transaccionService.transaction( Tipo_Transaccion.Guardar, ProductoOrdenCompra, producto );
      if (productoOC.status === 500) { return { status: 500, mensaje: Errores_Operaciones.EROR_CREAR }; }
      const objetoProducto = await this.transaccionService.transaction(Tipo_Transaccion.Consultar_Con_Parametros, ProductoOrdenCompra, '', 'productoOC_ID', productoOC.resultado.productoOC_ID);
      productosOC.push(objetoProducto.resultado[0]);
    }
    return productosOC;
  }

  async obtenerCuenta(cuentaID: number) {
    const cuenta = await this.transaccionService.transaction(Tipo_Transaccion.Consultar_Con_Parametros, Cuenta, '', 'cuenta_ID', cuentaID);
    let cuentas_completas = [];
    cuentas_completas.push(cuenta.resultado[0]);
    return cuentas_completas;
  }

  async obtenerProveedores(proveedorID: number) {
    let proveedores_completos = [];
    const proveedor = await this.transaccionService.transaction(Tipo_Transaccion.Consultar_Con_Parametros, Proveedore, '', 'proveedor_ID', proveedorID);
    proveedores_completos.push(proveedor.resultado[0]);
    return proveedores_completos;
  }

  async obtenerProducto(productos: any) {
    for (let i = 0; i < productos.length; i++) {
        const producto = await this.transaccionService.transaction(Tipo_Transaccion.Consultar_Con_Parametros, Producto, '', 'producto_ID', productos[i].productoOC_Producto_ID);
        productos[i].productoOC_Producto_ID = producto.resultado[0].producto_ID; 
    }
    return productos;
  }

  async update( id: number, updateDetalleOrdenCompraDto: UpdateDetalleOrdenCompraDto ) {
    const detalle_orden_compra = await this.transaccionService.transaction( Tipo_Transaccion.Actualizar_Con_Parametros, OrdenCompra, updateDetalleOrdenCompraDto, 'orden_compra_ID', id.toString() );
    if (detalle_orden_compra.status === 500) { return { status: 500, mensaje: 'Error al actualizar el detalle de la orden de compra', }; }
    return { status: 200, mensaje: 'Detalle de la orden de compra actualizado con éxito', resultado: detalle_orden_compra.resultado, };
  }

}
