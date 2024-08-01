import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ConfigService } from "@nestjs/config";
import { TransformInterceptor } from "./interceptors/transform.interceptor";
import { ValidationPipe } from "@nestjs/common";
import { UncaughtExceptionFilter } from "./exception/filters/UncaughtException.filter";
import { HttpExceptionFilter } from "./exception/filters/HttpException.filter";
import { UnauthorizedExceptionFilter } from "./exception/filters/UnauthorizedException.filter";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { validationExceptionFactory } from "./exception/factories/validation-exception.factory";
import "./utils/concurrent.util";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix("api");
  app.enableCors();

  app.useGlobalInterceptors(new TransformInterceptor());

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      forbidUnknownValues: false,
      whitelist: true,
      exceptionFactory: validationExceptionFactory,
    }),
  );
  app.useGlobalFilters(app.get(UncaughtExceptionFilter));
  app.useGlobalFilters(app.get(HttpExceptionFilter));
  app.useGlobalFilters(app.get(UnauthorizedExceptionFilter));

  SwaggerModule.setup(
    "/api",
    app,
    SwaggerModule.createDocument(
      app,
      new DocumentBuilder()
        .setTitle("Search tool")
        .setDescription("Sample API for search tool using AI utils")
        .addBearerAuth()
        .build(),
    ),
    {
      swaggerOptions: {
        persistAuthorization: true,
        docExpansion: "none",
      },
    },
  );

  const configService = app.get(ConfigService);
  await app.listen(configService.get("PORT") || 3000);
}
bootstrap();
