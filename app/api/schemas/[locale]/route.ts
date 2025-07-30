import { NextResponse } from 'next/server'
import { readdir } from 'fs/promises'
import path from 'path'

export async function GET(request: Request, { params }: { params: { locale: string } }) {
  const { locale } = params
  const dir = path.join(process.cwd(), 'public', 'schemas', locale)
  try {
    const files = await readdir(dir)
    const jsonFiles = files.filter(f => f.endsWith('.json')).map(f => f.replace(/\.json$/, ''))
    return NextResponse.json(jsonFiles)
  } catch (e) {
    return NextResponse.json([], { status: 200 })
  }
} 