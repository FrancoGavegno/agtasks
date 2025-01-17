import { NextResponse } from 'next/server'
import {formTypes} from "@/utils/mockData";

export async function GET() {
  return NextResponse.json(formTypes)
}
