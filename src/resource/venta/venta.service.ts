import { Injectable, Logger } from '@nestjs/common';
// Importar los DTO (Data transfer object) para especificar la forma de los datos que se enviarán al servidor
import { CreateVentaDto } from './dto/create-venta.dto';
import { UpdateVentaDto } from './dto/update-venta.dto';
import { CreateDetalleVentaDto } from '../detalle_venta/dto/create-detalle_venta.dto';
// Importar el método para validar el rol del usuario, especificando que es un administrador el que puede realizar la acción
import { validarAdmin } from 'src/auth/guard/validateRole.guard';
// Importar el servicio de transacciones para realizar operaciones de base de datos de forma genérica
import { TransaccionService } from 'src/common/transaction/transaccion.service';
// Importar el enum de los tipos de transacciones, para especificar el tipo de operación que se realizará
import { Tipo_Transaccion } from 'src/common/enums/tipo_Transaccion.enum';
// Importar las entidades que serán utilizadas en el servicio, para poder realizar operaciones de base de datos
import { Venta } from './entities/venta.entity';
import { Producto } from '../productos/entities/producto.entity';
import { ProductoVenta } from '../detalle_venta/entities/detalle_venta.entity';
// Importar el servicio de detalle de venta para poder reutilizar los métodos de creación
import { DetalleVentaService } from '../detalle_venta/detalle_venta.service';
// Importar la interfaz de usuario para poder obtener los datos del usuario que realiza la petición
import { User_Interface } from 'src/common/interfaces/user.interface';
// Importa el DataSource para poder realizar operaciones de base de datos personalizadas
import { DataSource } from 'typeorm';

@Injectable()
export class VentaService {

  // Definir el método constructor con los servicios a utilizar en el servicio
  constructor(
    private transaccionService: TransaccionService,
    private detalleVentaService: DetalleVentaService,
    private dataSource: DataSource
  ) {}

  // Método para crear una venta, creando internamente el detalle de venta y la información necesaria para su funcionamiento
  async create(createVentaDto: CreateVentaDto, user: User_Interface) {
    // Validar que un administrador esté realizando la acción
    const validar = validarAdmin(user);
    // Si el usuario no es administrador, retornar un mensaje de error
    if (validar !== true) { return { status: 500, mensaje: validar }; }
    // Crear un objeto, con los campos especificados en el DTO, para almacenar la información del detalle de venta y procesarla
    const informacion_detalle_venta: CreateDetalleVentaDto = {
      detalleVenta_TotalProductosVendidos: createVentaDto.detalleVenta_TotalProductosVendidos,
      detalleVenta_MontoTotal: createVentaDto.detalleVenta_MontoTotal,
      detalleVentaCorreoCliente: createVentaDto.detalleVentaCorreoCliente,
      detalleVentaNombreCliente: createVentaDto.detalleVentaNombreCliente,
      cuenta_ID: createVentaDto.cuenta_ID,
      producto_ID: createVentaDto.producto_ID,
    };
    // Utilizar el método de crear un detalle de venta, pertececiente al servicio de detalle de venta, para crear el detalle de venta
    const crear_detalle_venta = await this.detalleVentaService.create( informacion_detalle_venta );
    // Si el detalle de venta no se creó correctamente, retornar un mensaje de error
    if (crear_detalle_venta.status === 500) { return { status: crear_detalle_venta.status, mensaje: crear_detalle_venta.mensaje }; }
    // Crear un objeto con la información de la venta, para almacenar la información de la venta y procesarla
    const informacion_venta = {
      // Almacenar el ID del detalle de venta creado, para relacionar la venta con el detalle de venta
      venta_DetalleVenta_ID: crear_detalle_venta.resultado.detalleVenta_ID,
      venta_EstadoVenta: createVentaDto.venta_EstadoVenta,
      venta_FechaRegistro: new Date(),
    };
    // Utilizar el método de transacción, pertececiente al servicio de transacciones, para crear la venta, ya con el detalle de venta asociado
    const venta = await this.transaccionService.transaction( Tipo_Transaccion.Guardar, Venta, informacion_venta );
    // Si la venta no se creó correctamente, retornar un mensaje de error
    if (venta.status === 500) { return { status: 500, mensaje: 'Error al crear la venta' }; }
    // Retornar un mensaje de éxito, indicando que la venta se creó correctamente
    return { status: 200, mensaje: 'Venta creada con éxito' };
  }

  // Método para obtener todas las ventas, sin filtrar por algún campo en específico
  async findAll() {
    // Retornar todas las ventas, utilizando el método de transacción, pertececiente al servicio de transacciones
    const ventas = await this.transaccionService.transaction( Tipo_Transaccion.Consultar, Venta, '' );
    return ventas;
  }

  async obtenerVentas() {
    const ventas = await this.dataSource
    .getRepository(Venta)
    .createQueryBuilder('venta')
    .leftJoin('venta.venta_DetalleVenta_ID', 'DetalleVenta')
    .leftJoin('DetalleVenta.detalleVenta_ProductoVenta_ID', 'ProductoVenta')
    .leftJoin('DetalleVenta.cuenta_ID', 'Cuenta')
    .select([
      'venta.venta_ID',
      'venta.venta_EstadoVenta',
      'venta.venta_FechaRegistro',
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

    return ventas;
  }

  // Método para obtener una venta en específico, filtrando por el ID de la venta
  async findOne(id: number) {
    const venta = await this.transaccionService.transaction( Tipo_Transaccion.Consultar_Con_Parametros, Venta, '', 'venta_ID', id.toString(), );
    return venta;
  }

  // Método para actualizar un estado de venta, mediante el ID de la venta y el nuevo estado de la venta
  async update( id: number, updateVentaDto: UpdateVentaDto, user: User_Interface ) {
    // Validar que un administrador esté realizando la acción
    const validar = validarAdmin(user);
    if (validar !== true) { return { status: 500, mensaje: validar }; }
    // Cambiar el estado de la venta, pudiendo ser: 'Finalizado', 'Reembolsado'
    const venta = await this.transaccionService.transaction( Tipo_Transaccion.Actualizar_Con_Parametros, Venta, updateVentaDto.venta_EstadoVenta, 'venta_EstadoVenta', id.toString() );
    // Retorna un mensaje de éxito, indicando que la venta se actualizó correctamente
    return venta;
  }

  async remove(id: number, user: User_Interface) {
    const venta = await this.transaccionService.transaction( Tipo_Transaccion.Eliminar_Con_Parametros, Venta, '', 'venta_ID', id.toString(), );
    if (venta.status === 500) { return { status: 500, mensaje: 'Error al eliminar la venta' }; }
    return { status: 200, mensaje: 'Venta eliminada con éxito' };
  }
}
