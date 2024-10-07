import { ProveedoresService } from './../proveedores/proveedores.service';
import { Injectable, Logger } from '@nestjs/common';

// Importa el DTO CreateProductoDto, para definir la estructura de los datos que se envían al crear un producto
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';
// Importa el servicio TransaccionService para realizar transacciones con la base de datos
import { TransaccionService } from 'src/common/transaction/transaccion.service';
// Importa el enum Tipo_Transaccion para definir los tipos de transacciones que se pueden realizar
import { Tipo_Transaccion } from 'src/common/enums/tipo_Transaccion.enum';
// Importa la interfaz User_Interface para definir la estructura de los datos del usuario, y validar los roles de acceso
import { User_Interface } from 'src/common/interfaces/user.interface';
// Importa la entidad Producto, para realizar las transacciones con la tabla producto
import { Producto } from './entities/producto.entity';
// Importa el método validarAdmin para validar los roles de acceso al utilizar los métodos del servicio
import { validarAdmin } from 'src/auth/guard/validateRole.guard';
// Importa el DTO CreateInventarioDto, para definir la estructura de los datos que se envían al crear un inventario
import { CreateInventarioDto } from '../inventario/dto/create-inventario.dto';
// Importa el servicio InventarioService para reutilizar los métodos de creación de inventario
import { InventarioService } from '../inventario/inventario.service';
// Importa el enum enumProductoStatus, para definir los estados del producto
import { enumProductoStatus } from 'src/common/enums/inventario_status.enum';
// Importa el servicio para almacenar una imagen a Firebase
import { FirebaseService } from 'src/common/Firebase/firebase.service';

@Injectable()
export class ProductosService {
  // Inyecta el servicio InventarioService, el servicio TransaccionService y el servicio ProveedoresService en el servicio ProductosService
  constructor(
    private inventarioService: InventarioService,
    private transaccionService: TransaccionService,
    private proveedoresService: ProveedoresService,
    private firebaseService: FirebaseService
  ) {}

  // Método para crear un producto en la base de datos con su respectivo inventario
  async create(createProductoDto: CreateProductoDto, user: User_Interface) {
    // Valida si el usuario tiene el rol de Administrador
    const validar = validarAdmin(user);
    // Si el usuario no es Administrador, devuelve un mensaje de error
    if (validar !== true) {  return { status: 500, mensaje: validar }; }
    // Obtiene los proveedores completos, según los proveedores enviados en el DTO
    createProductoDto.producto_ProveedorID = await this.obtenerProveedores(createProductoDto.producto_ProveedorID, user);
    // Almacena la cantidad de productos en stock, y elimina la propiedad del DTO
    const stock = createProductoDto.producto_stock;
    delete createProductoDto.producto_stock;
    // Asigna el estado del producto como ACTIVO
    createProductoDto.producto_Status = enumProductoStatus.ACTIVO;
    createProductoDto.producto_ImagenURL = await this.firebaseService.AlmacenarImagen(createProductoDto.producto_ImagenURL, createProductoDto.producto_Nombre);
    // Realiza la transacción de guardar el producto en la base de datos con el DTO recibido
    const producto_nuevo = await this.transaccionService.transaction( Tipo_Transaccion.Guardar, Producto, createProductoDto );
    // Si ocurre un error al guardar el producto, devuelve un mensaje de error
    if (producto_nuevo.status == 500) { return { status: 500, mensaje: 'Error al crear el producto' }; } 
    // Si el producto se guarda con éxito, crea el inventario del producto en la base de datos
    else { await this.crearInventario({ inventario_ProductoID: producto_nuevo.resultado.producto_ID, inventario_Cantidad: stock }, user); }
    // Devuelve un mensaje de éxito al crear el producto
    return { status: 201, mensaje: 'Producto creado con éxito' };
  }

  async obtenerProveedores( proveedores: any, user: User_Interface) {
    // Crear arreglos para manipular los proveedores
    let proveedoresArrelgo = [];
    let proveedoresCompletos = [];
    // Si los proveedores están separados por punto y coma, los divide en un arreglo de proveedores
    if ( proveedores.includes(';') )  { proveedoresArrelgo = proveedores.split(';'); } else { proveedoresArrelgo = [proveedores]; }
    // Por cada proveedor en el arreglo, busca el proveedor en la base de datos y lo almacena en un arreglo de proveedores completos
    for (const proveedorNombre of proveedoresArrelgo) {
      // Busca el proveedor en la base de datos según el nombre del proveedor
      const proveedor = await this.proveedoresService.findOne(proveedorNombre, user);
      // Si el proveedor no se encuentra en la base de datos, devuelve un mensaje de error
      if (proveedor.status === 500 || proveedor.length === 0) { return { status: 500, mensaje: `Proveedor ${proveedorNombre} no encontrado` }; }
      // Si el proveedor se encuentra en la base de datos, lo almacena en el arreglo de proveedores complet
      proveedoresCompletos.push(proveedor[0]);
    }
    // Devuelve el arreglo de proveedores completos
    return proveedoresCompletos;
  }

  async crearInventario( createInventarioDTO: CreateInventarioDto, user: User_Interface ) {
    // Crea el inventario del producto en la base de datos con el DTO recibido
    const inventario = await this.inventarioService.create(createInventarioDTO, user);
    // Devuelve el inventario creado
    return inventario;
  }

  // Método para obtener todos los productos de la base de datos
  async update( id: number, updateProductoDto: UpdateProductoDto, user: User_Interface ) {
    // Valida si el usuario tiene el rol de Administrador
    const validar = validarAdmin(user);
    // Si el usuario no es Administrador, devuelve un mensaje de error
    if (validar !== true) { return { status: 500, mensaje: validar } }
    // Realiza la transacción de actualizar el producto en la base de datos con el DTO
    const producto_actualizado = await this.transaccionService.transaction( Tipo_Transaccion.Actualizar, Producto, updateProductoDto, 'producto_ID', id.toString() );
    // Si ocurre un error al actualizar el producto, devuelve un mensaje de error
    if (producto_actualizado.status === 500) { return { status: 500, mensaje: 'Error al actualizar el producto' }; }
    // Si el producto se actualiza con éxito, devuelve un mensaje de éxito
    return { status: 200, mensaje: 'Producto actualizado con éxito' };
  }

  async eliminar( id: number, user: User_Interface ) {
    // Valida si el usuario tiene el rol de Administrador
    const validar = validarAdmin(user);
    // Si el usuario no es Administrador, devuelve un mensaje de error
    if (validar !== true) { return { status: 500, mensaje: validar } }
    // Realiza la transacción de eliminar el producto en la base de datos con el ID recibido
    const producto_eliminado = await this.transaccionService.transaction( Tipo_Transaccion.Actualizar_Con_Parametros, Producto, 'INACTIVO', 'producto_Status', id.toString() );
    // Si ocurre un error al eliminar el producto, devuelve un mensaje de error
    if (producto_eliminado.status == 500) { return { status: 500, mensaje: 'Error al eliminar el producto' }; }
    // Si el producto se elimina con éxito, devuelve un mensaje de éxito
    return { status: 200, mensaje: 'Producto eliminado con éxito' };
  }

  async activar( id: number, user: User_Interface ) {
    // Valida si el usuario tiene el rol de Administrador
    const validar = validarAdmin(user);
    // Si el usuario no es Administrador, devuelve un mensaje de error
    if (validar !== true) { return { status: 500, mensaje: validar } }
    // Realiza la transacción de activar el producto en la base de datos con el ID recibido
    const producto_activado = await this.transaccionService.transaction( Tipo_Transaccion.Actualizar_Con_Parametros, Producto, 'ACTIVO', 'producto_Status', id.toString() );
    // Si ocurre un error al activar el producto, devuelve un mensaje de error
    if (producto_activado.status == 500) { return { status: 500, mensaje: 'Error al activar el producto' }; }
    // Si el producto se activa con éxito, devuelve un mensaje de éxito
    return { status: 200, mensaje: 'Producto activado con éxito' };
  }

}
