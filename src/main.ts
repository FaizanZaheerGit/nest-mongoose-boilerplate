import { NestFactory } from '@nestjs/core';
import { AppModule } from '@src/app.module';
import { ValidationPipe } from '@utils/validators/validator.pipe';
import { GlobalExceptionHandler } from '@utils/filters/global-exception.filter';
import { ResponseInterceptor } from '@utils/interceptors/response.interceptor';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppConfigService } from '@config/config.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const appConfigService: AppConfigService = app.get(AppConfigService);

  if (appConfigService.NODE_ENV.toLowerCase() !== 'production') {
    const config = new DocumentBuilder()
      .setTitle('Nest with Mongoose Boilerplate')
      .setDescription('Nest with Mongoose Boilerplate APIs')
      .setVersion('1.0')
      .addBearerAuth({
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'Authorization',
        in: 'header',
      })
      .build();
    const documentFactory = () => SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('/api/docs', app, documentFactory);
  }

  app.enableCors({
    origin: ['*'],
    credentials: true,
  });
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new GlobalExceptionHandler());
  app.useGlobalInterceptors(new ResponseInterceptor());
  await app.listen(process.env.PORT ?? 3000);
}

void bootstrap(); // NOTE: void has been added to avoid typescript floating promises error
