import dotenv from 'dotenv';
import seedData from './seedData';

// Load environment variables
dotenv.config();

// Run seed data
seedData()
  .then(() => {
    console.log('✅ Seeding concluído com sucesso!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Erro durante o seeding:', error);
    process.exit(1);
  });