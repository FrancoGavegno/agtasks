import { NextResponse } from 'next/server'
import { getCustomer } from '@/lib/integrations/jira'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const email = searchParams.get('email')
    const serviceDeskId = searchParams.get('serviceDeskId')

    if (!email || !serviceDeskId) {
      return NextResponse.json(
        { error: 'Email and serviceDeskId are required' },
        { status: 400 }
      )
    }

    const result = await getCustomer(email, serviceDeskId)

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 404 }
      )
    }

    return NextResponse.json(result.data)
  } catch (error) {
    console.error('Error in GET /api/v1/integrations/jira/customer:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
