import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Transaccion_Bancaria } from 'src/common/enums/transaccion_bancaria.enum';

@Entity('proveedor_banco')
export class ProveedorBanco {

    @PrimaryGeneratedColumn()
    proveedorBanco_ID: number;

    @Column({ type: 'bigint', nullable: true })
    proveedorBanco_CuentaBancaria: number;

    @Column({ type: 'varchar', length: 25, nullable: true })
    proveedorBanco_NombreBanco: string;

    @Column({ type: 'varchar', length: 30, nullable: true })
    proveedorBanco_NombreBeneficiario: string;

    @Column({ type: 'enum', nullable: true, enum: Transaccion_Bancaria, default: Transaccion_Bancaria.EFECTIVO })
    proveedorBanco_TipoTransaccion: Transaccion_Bancaria;
} 

@Entity('proveedores')
export class Proveedore {
    @PrimaryGeneratedColumn()
    proveedor_ID: number;  

    @Column({ type: 'varchar', length: 60, nullable: false })
    proveedor_Nombre: string;

    @Column({ type: 'varchar', length: 100, nullable: false })
    proveedor_Direccion: string;

    @Column({ type: 'bigint', nullable: false })
    proveedor_Telefono: number;

    @Column({ type: 'varchar', length: 60, nullable: false })
    proveedor_Email: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    proveedor_Catalogo: string;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', nullable: false, })
    proveedor_FechaCreacion: Date;

    @OneToOne(() => ProveedorBanco, {eager: true} )
    @JoinColumn({ name: 'proveedorBanco_ID' })
    proveedorBanco_ID: ProveedorBanco;
}

