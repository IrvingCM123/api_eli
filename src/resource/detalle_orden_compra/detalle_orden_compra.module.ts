import { Module } from '@nestjs/common';
import { DetalleOrdenCompraService } from './detalle_orden_compra.service';
import { DetalleOrdenCompraController } from './detalle_orden_compra.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DetalleOrdenCompra, ProductoOrdenCompra } from './entities/detalle_orden_compra.entity';
import { Producto } from '../productos/entities/producto.entity';
import { Proveedore } from '../proveedores/entities/proveedore.entity';
import { Cuenta } from '../cuentas/entities/cuenta.entity';
import { TransaccionModule } from 'src/common/transaction/transaccion.module';
import { InventarioModule } from '../inventario/inventario.module';

@Module({
  controllers: [DetalleOrdenCompraController],
  providers: [DetalleOrdenCompraService],
  imports: [TypeOrmModule.forFeature([DetalleOrdenCompra, Producto, Proveedore, Cuenta, ProductoOrdenCompra]), TransaccionModule, InventarioModule],
  exports: [DetalleOrdenCompraService]
})
export class DetalleOrdenCompraModule {}
