import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { applyExperimentProxy } from './proxy';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Forward /exercises/* and /experiments/* (all methods) to the remote server.
  await applyExperimentProxy(app);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
