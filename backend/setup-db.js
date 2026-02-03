const { exec } = require('child_process');
const fs = require('fs');

console.log('🚀 Setting up database...');

// Check if .env exists
if (!fs.existsSync('.env')) {
  console.error('❌ .env file not found. Please create it first.');
  process.exit(1);
}

// Run database setup commands
const commands = [
  'npx prisma generate',
  'npx prisma migrate dev --name init'
];

async function runCommand(command) {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`❌ Error: ${error.message}`);
        reject(error);
        return;
      }
      if (stderr) {
        console.log(`⚠️  ${stderr}`);
      }
      console.log(stdout);
      resolve();
    });
  });
}

async function setupDatabase() {
  try {
    console.log('📦 Generating Prisma client...');
    await runCommand(commands[0]);
    
    console.log('🗄️  Running database migrations...');
    await runCommand(commands[1]);
    
    console.log('✅ Database setup complete!');
    console.log('💡 Run "npm run studio" to view your database');
  } catch (error) {
    console.error('❌ Setup failed:', error.message);
    process.exit(1);
  }
}

setupDatabase();