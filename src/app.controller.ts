import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('categorias-productos')
  async obtenerCategoriaProductos(){
    return this.appService.obtenerCategoriaProductos();
  }

  @Get('tipos-transaccion')
  async obtenerTipoTransaccion(){
    return this.appService.obtenerTipoTransaccion();
  }

}
