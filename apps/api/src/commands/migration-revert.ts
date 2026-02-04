import { execSync } from 'child_process';

const command = `npx ts-node --project tsconfig.typeorm.json -r tsconfig-paths/register ./node_modules/typeorm/cli.js -d src/database/data-source.ts migration:revert`;

console.log(`Running: ${command}\n`);

try {
  execSync(command, { stdio: 'inherit' });
} catch {
  process.exit(1);
}
