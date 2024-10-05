import { Module } from '@nestjs/common';
import { TransaccionService } from './transaccion.service';

@Module({
    controllers: [],
    providers: [TransaccionService],
    exports: [TransaccionService],
})
export class TransaccionModule { }
