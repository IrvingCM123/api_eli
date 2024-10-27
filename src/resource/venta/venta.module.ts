import { Module } from '@nestjs/common';
import { VentaService } from './venta.service';
import { VentaController } from './venta.controller';

import { TypeOrmModule } from '@nestjs/typeorm';
import { Venta } from './entities/venta.entity';
import { DetalleVenta } from '../detalle_venta/entities/detalle_venta.entity';
import { TransaccionModule } from 'src/common/transaction/transaccion.module';
import { DetalleVentaModule } from '../detalle_venta/detalle_venta.module';
import { ClientModule } from 'src/client/client.module';

@Module({
  controllers: [VentaController],
  providers: [VentaService],
  imports: [TypeOrmModule.forFeature([Venta, DetalleVenta]), ClientModule, TransaccionModule, DetalleVentaModule],
  exports: [VentaService],
})
export class VentaModule {}
