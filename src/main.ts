import { NestFactory } from '@nestjs/core';

import { AppModule } from './modules/app/app.module';
import { setup } from './setup';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const port = setup(app);

  await app.listen(port);
}
bootstrap();
