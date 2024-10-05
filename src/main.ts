import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as bodyParser from 'body-parser';

import * as dotenv from 'dotenv';

async function bootstrap() {

  const app = await NestFactory.create(AppModule, { cors: true } );

  app.use(bodyParser.json({ limit: '50mb' }));  // Aumenta el tamaño permitido
  app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

  //Habilitar CORS para que el servidor pueda ser accedido desde cualquier origen
  app.enableCors();

  //Establecer el prefijo de la ruta global
  app.setGlobalPrefix('servidor');

  // Habilitar Logger de NestJS
  const logger = new Logger('Bootstrap');

  //Configurar la documentación de Swagger 
  const options = new DocumentBuilder()
    .setTitle('API de Inventario')
    .setDescription('Documentación de la API de Inventario')
    .setVersion('1.0')
    .addTag('Inventario')
    .build();

  // Crear el documento de Swagger 
  const document = SwaggerModule.createDocument(app, options);

  // Configurar la documentación de Swagger
  SwaggerModule.setup('api', app, document);

  app.useGlobalPipes(
    new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
    })
  );

  dotenv.config();

  await app.listen(80);
  logger.log('Aplicación en ejecución');
}
bootstrap();