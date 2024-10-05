import { Module } from '@nestjs/common';
import { ProveedoresService } from './proveedores.service';
import { ProveedoresController } from './proveedores.controller';

import { TypeOrmModule } from '@nestjs/typeorm';
import { ProveedorBanco, Proveedore } from './entities/proveedore.entity';
import { TransaccionModule } from 'src/common/transaction/transaccion.module';

@Module({
  controllers: [ProveedoresController],
  providers: [ProveedoresService],
  imports: [TypeOrmModule.forFeature([ProveedorBanco, Proveedore]), TransaccionModule],
  exports: [ProveedoresService],
})
export class ProveedoresModule {}
