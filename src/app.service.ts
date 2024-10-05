import { Injectable } from '@nestjs/common';
import { enumTipoProducto } from './common/enums/tipos_productos.enum';
import { Transaccion_Bancaria } from './common/enums/transaccion_bancaria.enum';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  async obtenerCategoriaProductos(){
    const categoriasProductos = Object.values(enumTipoProducto);
    return categoriasProductos;
  }

  async obtenerTipoTransaccion(){
    const tiposTransaccion = Object.values(Transaccion_Bancaria);
    return tiposTransaccion;
  }

}
