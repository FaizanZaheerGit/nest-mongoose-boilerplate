import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from '@src/app.module';
import { ValidationPipe } from '@utils/validators/validator.pipe';
import { GlobalExceptionHandler } from '@utils/filters/global-exception.filter';
import { ResponseInterceptor } from '@utils/interceptors/response.interceptor';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppConfigService } from '@config/config.service';
import { Logger } from 'nestjs-pino';

// TODO: Implement proper healthcheck with terminus
// TODO: Implement graceful shutdown
// TODO: Replace Send Grid Items with Generic Mailer Items to send e-mail from any SMTP
// TODO: Implement Redis Caching mecahnism (if needed)
// TODO: Try Lazy Loading Modules to see how it affects performance and start up time

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });

  app.useLogger(app.get(Logger));

  const appConfigService: AppConfigService = app.get(AppConfigService);
  const reflector: Reflector = app.get(Reflector);

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
    SwaggerModule.setup('/api/v1/docs', app, documentFactory);
  }

  app.enableCors({
    origin: ['*'],
    credentials: true,
  });
  app.setGlobalPrefix('/api/v1', { exclude: ['/'] });
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new GlobalExceptionHandler());
  app.useGlobalInterceptors(new ResponseInterceptor(reflector));
  await app.listen(appConfigService.PORT ?? 5000);
}

void bootstrap(); // NOTE: void has been added to avoid typescript floating promises error
