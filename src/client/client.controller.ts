import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ClientService } from './client.service';
import { cliente_email, proveedor_email } from 'src/common/interfaces/email.interface';

@Controller('client')
export class ClientController {
  constructor(private readonly clientService: ClientService) {}

  @Post('cliente')
  email_cliente(@Body() Data: cliente_email) {
    const { Fecha, Cliente, Productos, Total, subject } = Data;
    return this.clientService.email_cliente(Fecha, Cliente, Productos, Total, subject);
  }

  @Post('proveedor')
  email_proveedor(@Body() Data: proveedor_email) {
    const { Fecha, Proveedor, Productos, subject } = Data;
    return this.clientService.email_proveedor(Fecha, Proveedor, Productos, subject);
  }

}
