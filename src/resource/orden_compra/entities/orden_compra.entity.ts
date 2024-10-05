import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { EstadoVenta } from 'src/common/enums/estado_Venta.enum';
import { DetalleOrdenCompra } from 'src/resource/detalle_orden_compra/entities/detalle_orden_compra.entity';
// Define la entidad de la tabla orden_compra, almacenando la tabla orden_compra en la base de datos
@Entity('orden_compra')
export class OrdenCompra {
    // Define el identificador de la tabla orden_compra, como clave primaria y autoincremental
    @PrimaryGeneratedColumn()
    orden_compra_ID: number;
    // Define la columna orden_compra_estado, como tipo enumeración, no nulo, almacenando el estado de la orden de compra
    @Column({ type: 'enum', enum:EstadoVenta ,nullable: false })
    orden_compra_estado: EstadoVenta;
    // Define la columna orden_compra_fecha_ordenado, como tipo fecha y hora, no nulo, almacenando la fecha y hora de la orden de compra
    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', nullable: true })
    orden_compra_fecha_ordenado: Date;
    // Define la columna orden_compra_fecha_entregado, como tipo fecha y hora, no nulo, almacenando la fecha y hora de entrega de la orden de compra
    @Column({ type: 'timestamp', nullable: true })
    orden_compra_fecha_entregado: Date | string;
    // Almacena el identificador del detalle de la orden de compra relacionado con la orden de compra
    @OneToOne( () => DetalleOrdenCompra, { eager: true, cascade: true })
    @JoinColumn({ name: 'detalleOC_ID' })
    detalle_orden_compra_ID: DetalleOrdenCompra;

}
