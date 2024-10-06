import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { CuentasModule } from './resource/cuentas/cuentas.module';
import { AuthModule } from './auth/auth.module';
import { ProveedoresModule } from './resource/proveedores/proveedores.module';
import { ProductosModule } from './resource/productos/productos.module';
import { VentaModule } from './resource/venta/venta.module';
import { DetalleVentaModule } from './resource/detalle_venta/detalle_venta.module';
import { DetalleOrdenCompraModule } from './resource/detalle_orden_compra/detalle_orden_compra.module';
import { OrdenCompraModule } from './resource/orden_compra/orden_compra.module';
import { ClientModule } from './client/client.module';
import { InventarioModule } from './resource/inventario/inventario.module';

//Importación de las variables secretas 
const dotenv_config = require('dotenv').config();

//Acceso a las variables secretas 
const secrets = dotenv_config.parsed;

//Exportación de las variables secretas
const host_local = secrets.PG_HOST_LOCAL;
const port_local = secrets.PG_PORT_LOCAL;
const user_local = secrets.PG_USER_LOCAL;
const password_local = secrets.PG_PASSWORD_LOCAL;
const database_local = secrets.PG_DATABASE_LOCAL;

const host_prod = secrets.PG_HOST_PROD;
const port_prod = secrets.PG_PORT_PROD;
const user_prod = secrets.PG_USER_PROD;
const password_prod = secrets.PG_PASSWORD_PROD;
const database_prod = secrets.PG_DATABASE_PROD;

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      
      host: host_prod,
      port: parseInt(port_prod),
      username: user_prod,
      password: password_prod,
      database: database_prod,
      synchronize: true, // Mapear o Crear las tablas definidas en los .entity
      autoLoadEntities: true, // Cargar las entidades de forma automática
      extra: {
        ssl: true, // PROTOCOLO SSL QUE PERMITE UNA CONEXION EN UNA BASE DE DATOS EN RED
        sslmode: 'require', // MODO DE SSL
      }, 
    }), 
    ClientModule,
    CuentasModule,
    AuthModule,
    ProveedoresModule,
    ProductosModule,
    DetalleVentaModule,
    VentaModule,
    DetalleOrdenCompraModule,
    OrdenCompraModule,
    InventarioModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
