import { INestApplication, RequestMethod, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpAdapterHost } from '@nestjs/core';
import { PrismaClientExceptionFilter } from 'nestjs-prisma';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';

export const setup = (app: INestApplication) => {
  const configService = app.get(ConfigService);

  // Set Prisma exception filter
  const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalFilters(new PrismaClientExceptionFilter(httpAdapter));

  // Set global validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );

  app.setGlobalPrefix('api', {
    exclude: [{ path: '/', method: RequestMethod.GET }],
  });

  app.use(cookieParser());

  // Set cors
  const frontEndUrl: string = configService.get('FRONTEND_URL')!;

  app.enableCors({
    origin: [...frontEndUrl.split(' ')],
    credentials: true,
  });

  // Set Swagger
  const config = new DocumentBuilder()
    .addBearerAuth()
    .setTitle('Book Store API')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  return (configService.get('PORT') || 4000) as number;
};
