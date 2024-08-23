import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle("HH RU TEST API")
    .setDescription("HH RU TEST API")
    .setVersion('1.0')
    .addTag('tables')
    .build()

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('readme', app, document);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true
    })
  )
  app.enableCors({
    origin: '*',
    credentials: true
  })
  await app.listen(3001);
}
bootstrap();
