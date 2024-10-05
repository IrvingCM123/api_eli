import { Column, Entity, PrimaryGeneratedColumn, ManyToMany, JoinTable, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { Cuenta } from 'src/resource/cuentas/entities/cuenta.entity';
import { EstadoVenta } from 'src/common/enums/estado_Venta.enum';

// Define la entidad de la tabla detalle_venta, almacenando la tabla detalle_venta en la base de datos
@Entity('detalle_venta')
export class DetalleVenta {
    // Define el identificador de la tabla detalle_venta, como clave primaria y autoincremental
    @PrimaryGeneratedColumn()
    detalleVenta_ID: number; 
    // Define la columna detalleVenta_FechaVenta, como tipo fecha y hora, no nulo, almacenando la fecha y hora de la venta
    @Column({ type: 'int', nullable: false })
    detalleVenta_TotalProductosVendidos: number;
    // Define la columna detalleVenta_MontoTotal, como tipo decimal, no nulo, almacenando el monto total de la venta
    @Column({ type: 'decimal', nullable: false })
    detalleVenta_MontoTotal: number;
    // Define la columna detalleVenta_CorreoCliente, como tipo cadena de texto, almacenando el correo del cliente
    @Column({ type: 'varchar', nullable: true })
    detalleVentaCorreoCliente: string;
    // Define la columna detalleVenta_NombreCliente, como tipo cadena de texto, almacenando el nombre del cliente
    @Column({ type: 'varchar', nullable: true })
    detalleVentaNombreCliente: string;
    // Define la columna cuenta_ID, como tipo entero, no nulo, almacenando el identificador de la cuenta
    @ManyToMany(() => Cuenta, { eager: true, cascade: true })
    @JoinTable({name: 'detalle_venta_cuenta'})
    cuenta_ID: Cuenta[];
    // Relaciona la tabla detalle_venta con la tabla producto_venta, almacenando el identificador de la tabla producto_venta, permitiendo que un detalle de venta pueda tener varios productos de venta
    @OneToMany( () => ProductoVenta, productoVenta => productoVenta.detalleVenta_ProductoVenta_ID, { cascade: true, eager: true } )
    @JoinColumn({ name: 'detalleVenta_ProductoVenta_ID' })
    detalleVenta_ProductoVenta_ID: ProductoVenta[];
}

// Define la entidad de la tabla producto_venta, almacenando la tabla producto_venta en la base de datos
@Entity('producto_venta')
export class ProductoVenta {
    // Define el identificador de la tabla producto_venta, como clave primaria y autoincremental
    @PrimaryGeneratedColumn()
    productoVenta_ID: number;
    // Define la columna productoVenta_CantidadProducto, como tipo entero, no nulo, almacenando la cantidad de productos de la venta
    @Column({ type: 'integer' })
    productoVenta_CantidadProducto: number;
    // Define la columna productoVenta_PrecioProducto, como tipo decimal, no nulo, almacenando el precio del producto
    @Column({ type: 'decimal' })
    productoVenta_PrecioProducto: number;
    // Define la columna productoVenta_SubtotalVenta, como tipo decimal, no nulo, almacenando el subtotal de la venta
    @Column({ type: 'decimal' })
    productoVenta_SubtotalVenta: number;
    // Define la columna productoVenta_NombreProducto, como tipo cadena de texto, no nulo, almacenando el nombre del producto
    @Column({ type: 'varchar' })
    productoVenta_NombreProducto: string;
    // Define la columna productoVenta_ProductoID, como tipo entero, no nulo, almacenando el identificador del producto
    @Column()
    productoVenta_ProductoID: number;
    // Relaciona la tabla producto_venta con la tabla detalle_venta, almacenando el identificador de la tabla detalle_venta, permitiendo que un producto de venta pueda tener varios detalles
    @ManyToOne(() => DetalleVenta, detalleVenta => detalleVenta.detalleVenta_ProductoVenta_ID)
    detalleVenta_ProductoVenta_ID: DetalleVenta;

}
