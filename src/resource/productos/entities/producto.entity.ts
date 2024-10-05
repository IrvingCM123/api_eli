import { enumProductoStatus } from 'src/common/enums/inventario_status.enum';
import { enumTipoProducto } from 'src/common/enums/tipos_productos.enum';
import { DetalleOrdenCompra, ProductoOrdenCompra } from 'src/resource/detalle_orden_compra/entities/detalle_orden_compra.entity';
import { Proveedore } from 'src/resource/proveedores/entities/proveedore.entity';
import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('producto')
export class Producto {

    @PrimaryGeneratedColumn()
    producto_ID: number;

    @Column({ type: 'varchar', length: 30, nullable: false })
    producto_Nombre: string;

    @Column({ type: 'enum', enum: enumTipoProducto })
    producto_Categoria: enumTipoProducto;

    @Column({ type: 'decimal', nullable: false })
    producto_Precio: number;

    @Column({ type: 'enum', enum: enumProductoStatus, default: enumProductoStatus.ACTIVO })
    producto_Status: enumProductoStatus;

    @Column({ type: 'varchar', nullable: false, length: 255 })
    producto_ImagenURL: string;

    @ManyToMany( () => Proveedore )
    @JoinTable()
    producto_ProveedorID: Proveedore[];
    
    @OneToMany( () => ProductoOrdenCompra, productoOC => productoOC.productoOC_Producto_ID)
    @JoinTable({ name: 'productoOC_Producto_ID' })
    producto_DetalleOC_ProductoID: DetalleOrdenCompra[];
}
