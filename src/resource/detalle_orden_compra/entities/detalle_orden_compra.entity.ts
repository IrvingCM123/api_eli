import { Cuenta } from 'src/resource/cuentas/entities/cuenta.entity';
import { Producto } from 'src/resource/productos/entities/producto.entity';
import { Proveedore } from 'src/resource/proveedores/entities/proveedore.entity';
import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

// Define la entidad de la tabla detalleOC, almacenando la tabla detalleOC en la base de datos
@Entity('detalleOC') 
export class DetalleOrdenCompra {

    // Define el identificador de la tabla detalleOC, como clave primaria y autoincremental
    @PrimaryGeneratedColumn() 
    detalleOC_ID: number;

    // Define la columna detalleOC_Cantidad_Producto, como tipo entero y no nulo, almacenando la cantidad de productos de la orden de compra
    @Column({ type: 'int', nullable: false })
    detalleOC_Cantidad_Producto: number;

    // Define la columna detalleOC_MontoTotal, como tipo decimal y no nulo, almacenando el monto total de la orden de compra
    @Column({ type: 'decimal', nullable: false })
    detalleOC_MontoTotal: number;

    // Relaciona la tabla detalleOC con la tabla producto, almacenando el identificador de la tabla producto, permitiendo que un proveedor pueda tener varios detalles de orden de compra
    @ManyToOne(() => Proveedore, (proveedores) => proveedores.proveedor_ID, { eager: true, cascade: true })
    @JoinTable({ name: 'detalleOC_Proveedor_ID' })
    detalleOC_Proveedor_ID: Proveedore;

    // Relaciona la tabla detalleOC con la tabla Cuenta, almacenando el identificador de la tabla Cuenta, permitiendo que una cuenta pueda tener varios detalles de orden de compra
    @ManyToOne( () => Cuenta, (cuentas) => cuentas.cuenta_ID, { eager: true, cascade: true })
    @JoinTable({ name: 'detalleOC_Cuenta_ID' })
    detalleOC_Cuenta_ID: Cuenta;

    // Relaciona la tabla detalleOC con la tabla productoOC, almacenando el identificador de la tabla productoOC, permitiendo que un detalle de orden de compra pueda tener varios productos de orden de compra
    @OneToMany(() => ProductoOrdenCompra, productoOrdenCompra => productoOrdenCompra.detalleOC_ProductoOC_ID, { eager:true, cascade: true })
    @JoinColumn({ name: 'detalleOC_ProductoOC_ID' })
    detalleOC_ProductoOC_ID: ProductoOrdenCompra[];
}

// Define la entidad de la tabla productoOC, almacenando la tabla productoOC en la base de datos
@Entity('productoOC') 
export class ProductoOrdenCompra {

    // Define el identificador de la tabla productoOC, como clave primaria y autoincremental
    @PrimaryGeneratedColumn()
    productoOC_ID: number;

    // Define la columna productoOC_Cantidad_Producto, como tipo entero y no nulo, almacenando la cantidad de productos de la orden de compra
    @Column({ type: 'int', nullable: false })
    productoOC_Cantidad_Producto: number;

    // Define la columna productoOC_Subtotal_OC, como tipo decimal, almacenando el subtotal de la orden de compra
    @Column({ type: 'decimal', nullable: true })
    productoOC_Subtotal_OC: number;

    // Define la columna productoOC_Nombre_Producto, como tipo cadena de texto, almacenando el nombre del producto de la orden de compra
    @Column({ type: 'varchar', nullable: false })
    productoOC_Nombre_Producto: string;

    @ManyToOne(() => Producto, (productos) => productos.producto_DetalleOC_ProductoID, { eager: true, cascade: true })
    productoOC_Producto_ID: Producto;

    // Relaciona la tabla productoOC con la tabla producto, almacenando el identificador de la tabla producto, permitiendo que un producto de orden de compra pueda tener varios productos
    @ManyToOne(() => DetalleOrdenCompra, detalleOrdenCompra => detalleOrdenCompra.detalleOC_ProductoOC_ID)
    detalleOC_ProductoOC_ID: DetalleOrdenCompra;
}
