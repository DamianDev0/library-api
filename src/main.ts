import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('library')
  
  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    whitelist: true, 
    forbidNonWhitelisted: true,
  }));

  app.enableCors(); 

  const config = new DocumentBuilder()
  .setTitle('Library API')
  .setDescription('API for managing books and libraries')
  .setVersion('1.0')
  .addApiKey(
    {
      type: 'apiKey',
      name: 'x-api-key',  
      in: 'header',      
      description: 'API Key for authentication',
    },
    'x-api-key'            
  )
  .build();

const document = SwaggerModule.createDocument(app, config);
SwaggerModule.setup('api', app, document);
  await app.listen(process.env.PORT || 3000);
}
bootstrap();
