import { Module } from '@nestjs/common';
import { ProductosService } from './productos.service';
import { ProductosController } from './productos.controller';
import { Producto } from './entities/producto.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Proveedore } from '../proveedores/entities/proveedore.entity';
import { ProveedoresModule } from '../proveedores/proveedores.module';
import { TransaccionModule } from 'src/common/transaction/transaccion.module';
import { ProductoVenta } from '../detalle_venta/entities/detalle_venta.entity';
import { Inventario } from '../inventario/entities/inventario.entity';
import { InventarioModule } from '../inventario/inventario.module';
import { FirebaseModule } from 'src/common/Firebase/Firebase.module';

@Module({
  controllers: [ProductosController],
  providers: [ProductosService],
  imports: [TypeOrmModule.forFeature([Producto, Proveedore, ProductoVenta, Inventario]), InventarioModule, ProveedoresModule, TransaccionModule, ProveedoresModule, FirebaseModule],
  exports: [ProductosService],
})
export class ProductosModule {}
