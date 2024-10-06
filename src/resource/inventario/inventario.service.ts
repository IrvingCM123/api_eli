import { Injectable } from '@nestjs/common';

// Importa el DTO CreateInventarioDto, para definir la estructura de los datos que se envían al crear un inventario
import { CreateInventarioDto } from './dto/create-inventario.dto';
import { UpdateInventarioDto } from './dto/update-inventario.dto';

// Importa la clase DataSource, para poder realizar consultas anidadas con propiedades personalizadas en las consultas
import { DataSource } from 'typeorm';

// Importa el servicio TransaccionService para realizar transacciones con la base de datos
import { TransaccionService } from 'src/common/transaction/transaccion.service';
// Importa el enum Tipo_Transaccion para definir los tipos de transacciones que se pueden realizar
import { Tipo_Transaccion } from 'src/common/enums/tipo_Transaccion.enum';
// Importa la interfaz User_Interface para definir la estructura de los datos del usuario, y validar los roles de acceso
import { User_Interface } from 'src/common/interfaces/user.interface';
// Importa los métodos validarAdmin y validarUsuario para validar los roles de acceso al utilizar los métodos del servicio
import { validarAdmin, validarUsuario } from 'src/auth/guard/validateRole.guard';
// Importa la entidad Inventario, para realizar las transacciones con la tabla inventario
import { Inventario } from './entities/inventario.entity';
// Importa el enum enumInventarioStatus, para definir los estados del inventario del producto
import { enumInventarioStatus } from 'src/common/enums/inventario_status.enum';
import { Producto } from '../productos/entities/producto.entity';
@Injectable()
export class InventarioService {

  // Inyecta el servicio TransaccionService y el servicio DataSource en el servicio InventarioService
  constructor(
    private transaccionService: TransaccionService,
    private dataSource: DataSource,
  ) {}

  // Método para crear un inventario de productos en la base de datos
  create(createInventarioDto: CreateInventarioDto, user: User_Interface) {
    // Valida si el usuario tiene el rol de Administrador
    const validar = validarAdmin(user);
    // Si el usuario no es Administrador, devuelve un mensaje de error
    if (validar !== true) { return { status: 500, mensaje: validar }; }
    // Valida el estado del inventario del producto, según la cantidad de productos en inventario
    const status = this.validarStock(createInventarioDto.inventario_Cantidad);
    // Crea un objeto con los datos del inventario del producto
    const objetoInventario = { ...createInventarioDto, inventario_Status: status }
    // Realiza la transacción de guardar el inventario del producto en la base de datos
    return this.transaccionService.transaction( Tipo_Transaccion.Guardar, Inventario, objetoInventario )
  }

  // Método para obtener todos los inventarios de productos en la base de datos, método que se utilizará en la vista del cliente Angular
  async findAll( user: User_Interface) {
    // Permite que cualquier usuario pueda acceder a los inventarios de productos
    const validar = validarUsuario(user);
    // Si el usuario no tiene los roles estipulados por el sistema, devuelve un mensaje de error
    if (validar !== true) { return { status: 500, mensaje: validar }; }

    // Realiza la consulta de los inventarios de productos en la base de datos, con las propiedades personalizadas de la consulta
    const productos = await this.dataSource
      .getRepository(Inventario)
      .createQueryBuilder('inventario')
      .leftJoin('inventario.inventario_ProductoID', 'producto')
      .leftJoin('producto.producto_ProveedorID', 'proveedor')
      .select([
        'inventario.inventario_Cantidad',
        'inventario.inventario_Status',
        'inventario.inventario_ID',
        'inventario.inventario_Cantidad',
        'producto.producto_ID',
        'producto.producto_Status',
        'producto.producto_Nombre',
        'producto.producto_Categoria',
        'producto.producto_Precio',
        'producto.producto_ImagenURL',
        'proveedor.proveedor_ID',
        'proveedor.proveedor_Nombre',
      ])
      .getMany();
    // Devuelve los inventarios de productos
    return productos;
  }

  // Método para actualizar la cantidad de productos en inventario, y el estado del inventario del producto
  async actualizarInventario(id: string, cantidad: number, user: User_Interface) {
    // Permite que cualquier usuario pueda actualizar la cantidad de productos en inventario
    const validar = validarUsuario(user);
    // Si el usuario no tiene los roles estipulados por el sistema, devuelve un mensaje de error
    if (validar !== true) { return { status: 500, mensaje: validar }; }
    // Realiza la transacción de actualizar la cantidad de productos en inventario en la base de datos
    const inventario = await this.transaccionService.transaction(Tipo_Transaccion.Actualizar_Con_Parametros, Inventario, cantidad, 'inventario_Cantidad', id );
    // Asigna el estado del inventario del producto, según la cantidad de productos en inventario
    const status = this.validarStock(inventario.resultado.inventario_Cantidad);
    // Realiza la transacción de actualizar el estado del inventario del producto en la base de datos
    await this.transaccionService.transaction(Tipo_Transaccion.Actualizar_Con_Parametros, Inventario, status, 'inventario_Status', id );
    // Devuelve los datos del inventario del producto actual
    return inventario;
  }

  // Mismo método al anterior, pero para uso interno del sistema, sin validación de roles de usuario
  async actualizarInventarioPrivate(productoID: string | number, cantidad: number) {
    const inventario_ID = await this.transaccionService.transaction( Tipo_Transaccion.Consultar_Con_Parametros, Inventario, '', 'inventario_ProductoID', productoID );
    console.log(inventario_ID, "inventario_ID");
    const inventario = await this.transaccionService.transaction(Tipo_Transaccion.Actualizar_Con_Parametros, Inventario, cantidad, 'inventario_Cantidad', inventario_ID.resultado[0].inventario_ID );
    return inventario;
  }

  async eliminarInventarioPrivate(productoID: string | number, cantidadRestar: number) {
    // Obtiene el ID del producto que se está vendiendo, a través del ID del producto
    const producto = await this.transaccionService.transaction( Tipo_Transaccion.Consultar_Con_Parametros, Producto, '', 'producto_ID', productoID );
    // Almacenar el ID del producto en una nueva variable
    const id = producto.resultado[0].producto_ID;
    // Obtiene el inventario del producto que se está vendiendo, a través del ID del producto que se está vendiendo 
    const inventario = await this.dataSource.getRepository(Inventario).createQueryBuilder('inventario').where('inventario.inventario_ProductoID = :id', { id }).getOne();
    // Asigna a una nueva variable la cantidad de productos en inventario, restando la cantidad de productos vendidos
    const nuevoStock = inventario.inventario_Cantidad - cantidadRestar;
    // Si la cantidad de productos en inventario es menor a 0, devuelve un mensaje de error ya que no hay suficientes productos en inventario
    if (nuevoStock < 0) { return { status: 500, mensaje: 'No hay suficientes productos en inventario' } }
    // Se le asigna la nueva cantidad de productos en inventario al inventario del producto para ser actualizado
    inventario.inventario_Cantidad = nuevoStock;
    // Se obtiene el estado del inventario según la cantidad de productos en inventario
    const status = this.validarStock(nuevoStock);
    // Se le asigna el nuevo estado del inventario del producto al inventario del producto para ser actualizado
    inventario.inventario_Status = status;
    // Realiza la transacción de actualizar el inventario del producto en la base de datos con los nuevos datos
    const inventarioActualizado = await this.transaccionService.transaction(Tipo_Transaccion.Guardar, Inventario, inventario );
    // Si hay un error al actualizar el inventario, devuelve un mensaje de error
    if (inventarioActualizado.status === 500) { return { status: 500, mensaje: 'Error al actualizar el inventario' } } 
    // Si el inventario se actualiza con éxito, devuelve un mensaje de éxito
    else { return { status: 201, mensaje: 'Inventario actualizado con éxito' } }
  }

  async aumentarInventarioPrivate(productoID: string | number, cantidadRestar: number) {
    // Obtiene el ID del producto que se está vendiendo, a través del ID del producto
    const producto = await this.transaccionService.transaction( Tipo_Transaccion.Consultar_Con_Parametros, Producto, '', 'producto_ID', productoID );
    // Almacenar el ID del producto en una nueva variable
    const id = producto.resultado[0].producto_ID;
    // Obtiene el inventario del producto que se está vendiendo, a través del ID del producto que se está vendiendo 
    const inventario = await this.dataSource.getRepository(Inventario).createQueryBuilder('inventario').where('inventario.inventario_ProductoID = :id', { id }).getOne();
    // Asigna a una nueva variable la cantidad de productos en inventario, restando la cantidad de productos vendidos
    const nuevoStock = inventario.inventario_Cantidad + cantidadRestar;
    // Se le asigna la nueva cantidad de productos en inventario al inventario del producto para ser actualizado
    inventario.inventario_Cantidad = nuevoStock;
    // Se obtiene el estado del inventario según la cantidad de productos en inventario
    const status = this.validarStock(nuevoStock);
    // Se le asigna el nuevo estado del inventario del producto al inventario del producto para ser actualizado
    inventario.inventario_Status = status;
    // Realiza la transacción de actualizar el inventario del producto en la base de datos con los nuevos datos
    const inventarioActualizado = await this.transaccionService.transaction(Tipo_Transaccion.Guardar, Inventario, inventario );
    // Si hay un error al actualizar el inventario, devuelve un mensaje de error
    if (inventarioActualizado.status === 500) { return { status: 500, mensaje: 'Error al actualizar el inventario' } } 
    // Si el inventario se actualiza con éxito, devuelve un mensaje de éxito
    else { return { status: 201, mensaje: 'Inventario actualizado con éxito' } }
  }

  // Método para eliminar un inventario de productos en la base de datos
  remove(id: number, user: User_Interface) {
    // Valida si el usuario tiene el rol de Administrador
    const validar = validarAdmin(user);
    // Si el usuario no es Administrador, devuelve un mensaje de error
    if (validar !== true) { return { status: 500, mensaje: validar }; }
    // Realiza la transacción de eliminar el inventario del producto en la base de datos
    return this.transaccionService.transaction(Tipo_Transaccion.Actualizar_Con_Parametros, Inventario, 'SIN_STOCK', 'inventario_Status', id);
  }

  // Método para validar el estado del inventario del producto, según la cantidad de productos en inventario
  validarStock(cantidad: number) {
    // Si la cantidad de productos en inventario es mayor a 5 y menor a 100, el estado del inventario es EN_STOCK
    if (cantidad > 5 && cantidad < 100) {
      return enumInventarioStatus.EN_STOCK;
      // Si la cantidad de productos en inventario es menor o igual a 5, el estado del inventario es POCO_STOCK
    } else if (cantidad <= 5) {
      return enumInventarioStatus.POCO_STOCK;
      // Si la cantidad de productos en inventario es mayor a 100, el estado del inventario es SOBRE_STOCK
    } else if (cantidad > 100) {
      return enumInventarioStatus.SOBRE_STOCK;
      // Si la cantidad de productos en inventario es igual a 0, el estado del inventario es SIN_STOCK
    } else if (cantidad === 0) {
      return enumInventarioStatus.SIN_STOCK;
    }
  }

}
