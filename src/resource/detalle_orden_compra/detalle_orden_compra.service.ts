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
  constructor(
    private transaccionService: TransaccionService,
  ) { }

  async create(createDetalleOrdenCompraDto: CreateDetalleOrdenCompraDto) {
    // Iterar los productos de la orden de compra para obtener la información de cada producto 
    const productos: any = await this.obtenerProducto(createDetalleOrdenCompraDto.detalleOC_ProductoOC);
    // Realizar la transacción para crear los productos de la orden de compra y almacenarlos en la base de datos
    const productoOC: any = await this.crearProductoOrdenCompra(productos)
    // Obtiene la información de la cuenta que realiza la orden de compra
    const cuenta: any = await this.obtenerCuenta(createDetalleOrdenCompraDto.detalleOC_Cuenta_ID);
    // Obtiene la información de los proveedores que suministran los productos de la orden de compra
    const proveedor: any = await this.obtenerProveedores(createDetalleOrdenCompraDto.detalleOC_Proveedor_ID);

    // Elimina la información de los productos de la orden de compra para evitar errores al crear el detalle de la orden de compra
    let informacion_detalle_compra: any = createDetalleOrdenCompraDto;
    delete informacion_detalle_compra.detalleOC_ProductoOC;

    // Se asigna la información de los productos de la orden de compra, la cuenta y el proveedor a la información del detalle de la orden de compra
    informacion_detalle_compra.detalleOC_ProductoOC_ID = productoOC;
    informacion_detalle_compra.detalleOC_Cuenta_ID = cuenta;
    informacion_detalle_compra.detalleOC_Proveedor_ID = proveedor[0];

    // Realiza la transacción para crear el detalle de la orden de compra y almacenarlo en la base de datos
    const detalle_orden_compra = await this.transaccionService.transaction( Tipo_Transaccion.Guardar, DetalleOrdenCompra, informacion_detalle_compra );
    // Verifica si se ha producido un error al crear el detalle de la orden de compra
    if (detalle_orden_compra.status === 500) { return { status: 500, mensaje: Errores_Operaciones.EROR_CREAR }; }
    // Si el detalle de la orden de compra se ha creado correctamente, se devuelve el resultado de la transacción
    return { status: 201, resultado: detalle_orden_compra.resultado };
  }

  // Realiza el registro de los productos de la orden de compra en la base de datos, y devuelve la información de los productos registrados
  async crearProductoOrdenCompra(crearProductoOC: productoOC[]) {
    // Crear un array para almacenar la información de los productos de la orden de compra
    let productosOC: ProductoOrdenCompra[] = [];

    // Iterar los productos de la orden de compra para obtener la información de cada producto
    for ( let producto of crearProductoOC ) {
      // Realizar la transacción para crear el producto de la orden de compra y almacenarlo en la base de datos
      const productoOC = await this.transaccionService.transaction( Tipo_Transaccion.Guardar, ProductoOrdenCompra, producto );
      // Si se produce un error al crear el producto de la orden de compra, se devuelve un mensaje de error
      if (productoOC.status === 500) { return { status: 500, mensaje: Errores_Operaciones.EROR_CREAR }; }
      // Si el producto de la orden de compra se ha creado correctamente, se almacena la información del producto en el array de productos de la orden de compra
      const objetoProducto = await this.transaccionService.transaction(Tipo_Transaccion.Consultar_Con_Parametros, ProductoOrdenCompra, '', 'productoOC_ID', productoOC.resultado.productoOC_ID);
      productosOC.push(objetoProducto.resultado[0]);
    }
    // Devuelve la información de los productos de la orden de compra
    return productosOC;
  }

  // Obtiene la información de la cuenta que realiza la orden de compra
  async obtenerCuenta(cuentaID: number) {
    const cuenta = await this.transaccionService.transaction(Tipo_Transaccion.Consultar_Con_Parametros, Cuenta, '', 'cuenta_ID', cuentaID);
    return cuenta.resultado[0];
  }

  // Obtiene la información de los proveedores que suministran los productos de la orden de compra|
  async obtenerProveedores(proveedorID: number) {
    let proveedores_completos = [];
    const proveedor = await this.transaccionService.transaction(Tipo_Transaccion.Consultar_Con_Parametros, Proveedore, '', 'proveedor_ID', proveedorID);
    proveedores_completos.push(proveedor.resultado[0]);
    return proveedores_completos;
  }

  // Obtiene la información de los productos de la orden de compra
  async obtenerProducto(productos: any) {
    for (let i = 0; i < productos.length; i++) {
        const producto = await this.transaccionService.transaction(Tipo_Transaccion.Consultar_Con_Parametros, Producto, '', 'producto_ID', productos[i].productoOC_Producto_ID);
        productos[i].productoOC_Producto_ID = producto.resultado[0]; 
    }
    return productos;
  }

  // Actualiza el detalle de la orden de compra en la base de datos, cambiando la información declarada en su respectivo DTO
  async update( id: number, updateDetalleOrdenCompraDto: UpdateDetalleOrdenCompraDto ) {
    const detalle_orden_compra = await this.transaccionService.transaction( Tipo_Transaccion.Actualizar_Con_Parametros, OrdenCompra, updateDetalleOrdenCompraDto, 'orden_compra_ID', id.toString() );
    if (detalle_orden_compra.status === 500) { return { status: 500, mensaje: 'Error al actualizar el detalle de la orden de compra', }; }
    return { status: 200, mensaje: 'Detalle de la orden de compra actualizado con éxito', resultado: detalle_orden_compra.resultado, };
  }

}
