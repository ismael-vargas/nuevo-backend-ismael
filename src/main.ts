import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Habilitar CORS (si es necesario)
  app.enableCors();

  // Configurar el ValidationPipe con transform: true
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true, // Habilita la transformación de tipos (importante)
      whitelist: true, // Elimina propiedades que no están en el DTO
      forbidNonWhitelisted: true, // Lanza un error si hay propiedades no permitidas en el DTO
    })
  );

  // Configuración de Swagger
  const config = new DocumentBuilder()
    .addBearerAuth()
    .setTitle('Backend API')
    .setDescription('Backend API')
    .setVersion('1.0')
    .addTag('Api Rest')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
}

bootstrap();
