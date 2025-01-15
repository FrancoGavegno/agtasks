import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  const dataDir = path.join(process.cwd(), 'public', 'data');
  const files = fs.readdirSync(dataDir);
  const jsonFiles = files.filter(file => path.extname(file).toLowerCase() === '.json');
  
  return NextResponse.json(jsonFiles);
}

