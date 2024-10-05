import { Module } from '@nestjs/common';
import { OrdenCompraService } from './orden_compra.service';
import { OrdenCompraController } from './orden_compra.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdenCompra } from './entities/orden_compra.entity';
import { DetalleOrdenCompra } from '../detalle_orden_compra/entities/detalle_orden_compra.entity';
import { TransaccionModule } from 'src/common/transaction/transaccion.module';
import { DetalleOrdenCompraModule } from '../detalle_orden_compra/detalle_orden_compra.module';

@Module({
  controllers: [OrdenCompraController],
  providers: [OrdenCompraService],
  imports: [TypeOrmModule.forFeature([OrdenCompra, DetalleOrdenCompra]), TransaccionModule, DetalleOrdenCompraModule],
  exports: [OrdenCompraService]
})
export class OrdenCompraModule {}
