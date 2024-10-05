import { DetalleVenta } from 'src/resource/detalle_venta/entities/detalle_venta.entity';
import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { EstadoVenta } from 'src/common/enums/estado_Venta.enum';
// Define la entidad de la tabla venta, almacenando la tabla venta en la base de datos
@Entity('venta')
export class Venta {
    // Define el identificador de la tabla venta, como clave primaria y autoincremental
    @PrimaryGeneratedColumn()
    venta_ID: number;
    // Define la columna venta_DetalleVenta_ID, como tipo entero, no nulo, almacenando el identificador del detalle de venta
    @OneToOne(() => DetalleVenta, { eager: true, cascade: true })
    @JoinColumn({ name: 'detalle_Venta_ID' })
    venta_DetalleVenta_ID?: DetalleVenta;
    // Define la columna venta_EstadoVenta, como tipo enumeración, no nulo, almacenando el estado de la venta
    @Column( {type: 'enum', enum: EstadoVenta , nullable: false })
    venta_EstadoVenta: EstadoVenta;
    // Define la columna venta_FechaRegistro, como tipo fecha y hora, no nulo, almacenando la fecha y hora de registro de la venta
    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', nullable: false })
    venta_FechaRegistro: Date;

}
