import { HttpCode, Injectable } from '@nestjs/common';
import { enviar_Email } from './methods/sendEmail.function';
import { enviar_proveedor } from './methods/enviar_proveedor.function';
import { CuentasService } from 'src/resource/cuentas/cuentas.service';
import { enviar_cliente } from './methods/enviar_cliente.function';
import { TransaccionService } from 'src/common/transaction/transaccion.service';

@Injectable()
export class ClientService {

  constructor(private cuentasService: CuentasService,
    private transaccionService: TransaccionService
  ) { }

  async email_proveedor(Fecha: any, Proveedor: string, Productos: any, subject: string) {
    const construir_template = await enviar_proveedor(Fecha, Proveedor, Productos);
    await enviar_Email(Proveedor, construir_template.template_email, subject);
    return {
      status: 201,
      message: 'Email sent successfully',
    };
  }

  async email_cliente(Fecha: any, Cliente: string, Productos: any, Total: number, subject: string) {
    const construir_template = await enviar_cliente(Fecha, Cliente, Productos, Total);
    await enviar_Email(Cliente, construir_template.template_email, subject);
    return {
      status: 201,
      message: 'Email sent successfully',
    };
  }


}
