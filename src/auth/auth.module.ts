import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from 'src/common/constants/jwt.constant';
import { TransaccionModule } from 'src/common/transaction/transaccion.module';
import { CuentasModule } from 'src/resource/cuentas/cuentas.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cuenta } from 'src/resource/cuentas/entities/cuenta.entity';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
    }),
    TransaccionModule,
    CuentasModule,
    TypeOrmModule.forFeature([Cuenta]),
  ],
  controllers: [AuthController],
  providers: [AuthService] // Servicio del modulo
})
export class AuthModule {}
