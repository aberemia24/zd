// [LECȚIE] Pentru orice operațiune pe date multi-user, asigură-te că există filtrare pe user_id atât la nivel de API cât și la nivel de politici RLS (defense in depth).
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3001);
}
bootstrap();
