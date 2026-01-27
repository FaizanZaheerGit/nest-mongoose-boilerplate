import { NestFactory } from '@nestjs/core';
import { SeederModule } from '@seeder/seeder.module';
import { SeederService } from '@seeder/seeder.service';
import prompts from 'prompts';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(SeederModule);
  const seederService = app.get(SeederService);

  const response = await prompts({
    type: 'select',
    name: 'choice',
    message: 'Which seed do you want to run?',
    choices: [
      { title: 'Seed First Admin', value: 'firstAdminScript' },
      { title: 'Seed Default Roles', value: 'defaultRolesScript' },
      { title: 'Run All Seeders', value: 'allSeeders' },
      { title: 'Exit', value: 'exit' },
    ],
  });

  switch (response.choice) {
    case 'firstAdminScript':
      await seederService.firstAdminSeedScript();
      break;
    case 'defaultRolesScript':
      await seederService.defaultRolesSeedScript();
      break;
    case 'allSeeders':
      await Promise.all([
        seederService.firstAdminSeedScript(),
        seederService.defaultRolesSeedScript(),
      ]);
      break;
    default:
      console.log('Invalid seed selection. Exiting...');
  }

  console.log(`\nClosing App..\n`);
  await app.close();
  console.log(`App Closed Successfully`);
  process.exit(0);
}

void bootstrap(); // NOTE: void added to avoid no floating promises typescript error
