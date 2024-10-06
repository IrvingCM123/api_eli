import { enumInventarioStatus } from "src/common/enums/inventario_status.enum";
import { DetalleVenta, ProductoVenta } from "src/resource/detalle_venta/entities/detalle_venta.entity";
import { Producto } from "src/resource/productos/entities/producto.entity";
import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";

// Define la entidad de la tabla inventario, almacenando la tabla inventario en la base de datos
@Entity('inventario')
export class Inventario {
 
    // Define el identificador de la tabla inventario, como clave primaria y autoincremental
    @PrimaryGeneratedColumn()
    inventario_ID: number;

    // Define la columna inventario_Status, como tipo enumerado, almacenando el estado del inventario del producto
    @Column( {type: 'enum', enum: enumInventarioStatus, default: enumInventarioStatus.EN_STOCK })
    inventario_Status: enumInventarioStatus;

    // Define la columna inventario_Cantidad, como tipo entero y no nulo, almacenando la cantidad de productos en inventario
    @Column({ type: 'int', nullable: false })
    inventario_Cantidad: number;

    // Define la columna inventario_Cantidad_Minima, como tipo entero y no nulo, almacenando la cantidad mínima de productos en inventario
    @Column({ type: 'int', default: 5 })
    inventario_Cantidad_Minima: number;

    // Define la columna inventario_Cantidad_Maxima, como tipo entero y no nulo, almacenando la cantidad máxima de productos en inventario
    @Column({ type: 'int', default: 100 })
    inventario_Cantidad_Maxima: number;

    // Define la columna inventario_Fecha_Registro, como tipo fecha y hora, almacenando la fecha de registro del inventario
    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', nullable: false })
    inventario_Fecha_Registro: Date;

    // Relaciona la tabla inventario con la tabla detalleVenta, almacenando el identificador de la tabla detalleVenta, permitiendo que un inventario pueda tener varios detalles de venta
    @OneToOne( () => Producto, { eager: true })
    @JoinColumn({ name: 'inventario_ProductoID' })
    inventario_ProductoID: Producto;

}
