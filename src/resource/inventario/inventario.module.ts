import { Module } from '@nestjs/common';
import { InventarioService } from './inventario.service';
import { InventarioController } from './inventario.controller';
import { Inventario } from './entities/inventario.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Producto } from '../productos/entities/producto.entity';
import { TransaccionModule } from 'src/common/transaction/transaccion.module';
import { ProductosModule } from '../productos/productos.module';
import { ProductoVenta } from '../detalle_venta/entities/detalle_venta.entity';

@Module({
  controllers: [InventarioController],
  providers: [InventarioService],
  imports: [TypeOrmModule.forFeature([Inventario, Producto, ProductoVenta]), TransaccionModule],
  exports: [InventarioService],
})
export class InventarioModule {}
