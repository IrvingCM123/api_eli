import { Module } from '@nestjs/common';
import { DetalleVentaService } from './detalle_venta.service';
import { DetalleVentaController } from './detalle_venta.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DetalleVenta, ProductoVenta } from './entities/detalle_venta.entity';
import { Producto } from '../productos/entities/producto.entity';
import { Cuenta } from '../cuentas/entities/cuenta.entity';
import { TransaccionModule } from 'src/common/transaction/transaccion.module';
import { Inventario } from '../inventario/entities/inventario.entity';
import { InventarioModule } from '../inventario/inventario.module';

@Module({
  controllers: [DetalleVentaController],
  providers: [DetalleVentaService],
  imports: [TypeOrmModule.forFeature([DetalleVenta, Inventario, Cuenta, ProductoVenta]), TransaccionModule, InventarioModule],
  exports: [DetalleVentaService],
})
export class DetalleVentaModule {}
