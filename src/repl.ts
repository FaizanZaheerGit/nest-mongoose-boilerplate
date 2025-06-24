import { repl } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  await repl(AppModule);
}

void bootstrap(); // NOTE: added void to avoid no floating promises ts error
