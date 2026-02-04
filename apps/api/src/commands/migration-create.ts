import { execSync } from 'child_process';

const args = process.argv.slice(2);
const nameArg = args.find((arg) => arg.startsWith('--name'));
let name = 'Migration';

if (nameArg) {
  const parts = nameArg.split('=');
  if (parts.length === 2) {
    name = parts[1];
  } else {
    const nameIndex = args.indexOf('--name');
    if (nameIndex !== -1 && args[nameIndex + 1]) {
      name = args[nameIndex + 1];
    }
  }
}

const command = `npx ts-node --project tsconfig.typeorm.json -r tsconfig-paths/register ./node_modules/typeorm/cli.js -d src/database/data-source.ts migration:create src/database/migrations/${name}`;

console.log(`Running: ${command}\n`);

try {
  execSync(command, { stdio: 'inherit' });
} catch {
  process.exit(1);
}
