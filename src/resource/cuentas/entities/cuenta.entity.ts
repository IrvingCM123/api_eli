import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn } from 'typeorm';
import { Roles } from "src/common/enums/roles.enum";
import { Estado_Logico } from "src/common/enums/estado_logico.enum";

// Permite registrar una tabla con sus campos en una base de datos automaticamente
@Entity('cuenta')
export class Cuenta {

    @PrimaryGeneratedColumn()
    cuenta_ID: number;

    @Column({ type: 'varchar', length: 30, nullable: false })
    cuenta_Nombre: string;

    @Column({ type: 'varchar', length: 30, nullable: false })
    cuenta_Apellido: string;

    @Column({ type: 'varchar', length: 30, nullable: false, unique: true })
    cuenta_Correo: string;

    @Column({ type: 'varchar', length: 255, nullable: false })
    cuenta_Contrasena: string;

    @Column({ type: 'enum', enum: Roles, nullable: false, default: Roles.ADMIN })
    cuenta_Rol: Roles;

    @Column({ type: 'enum', enum: Estado_Logico, nullable: false, default: Estado_Logico.ACTIVO })
    cuenta_Estado_Cuenta: Estado_Logico;

    @Column({ nullable: true })
    cuenta_Fecha_Registro?: Date;

}
