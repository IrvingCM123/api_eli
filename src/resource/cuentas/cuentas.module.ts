import { Module } from '@nestjs/common';
import { CuentasService } from './cuentas.service';
import { CuentasController } from './cuentas.controller';

import { TypeOrmModule } from '@nestjs/typeorm';
import { Cuenta } from 'src/resource/cuentas/entities/cuenta.entity';
import { TransaccionModule } from 'src/common/transaction/transaccion.module';

@Module({
  controllers: [CuentasController],
  providers: [CuentasService],
  imports: [
    TypeOrmModule.forFeature([Cuenta]),
    TransaccionModule,
  ],
  exports: [CuentasService],
})
export class CuentasModule {}
