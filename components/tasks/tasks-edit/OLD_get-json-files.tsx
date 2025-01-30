import fs from 'fs';
import path from 'path';

export function getJsonFiles() {
  const dataDir = path.join(process.cwd(), 'public', 'data');
  const files = fs.readdirSync(dataDir);
  return files.filter(file => path.extname(file).toLowerCase() === '.json');
}
