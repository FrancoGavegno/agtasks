import { NextResponse } from 'next/server'
import { 
  getCustomer, 
  createCustomer 
} from "@/lib/integrations/jira"
import type { JiraCustomerData } from '@/lib/interfaces/jira'

export async function GET(request: Request) {
    try {
      const { searchParams } = new URL(request.url);
      const email = searchParams.get('email');
  
      if (!email) {
        return NextResponse.json(
          { error: 'Missing email parameter' },
          { status: 400 }
        );
      }
  
      const accountId = await getCustomer(email);
      if (!accountId) {
        return NextResponse.json(
          { error: `No se encontró accountId para el email: ${email}` },
          { status: 404 }
        );
      }
  
      return NextResponse.json({ accountId });
    } catch (error) {
      console.error('Error en /customer route:', error);
      return NextResponse.json(
        { error: 'Error interno del servidor' },
        { status: 500 }
      );
    }
  }

  export async function POST(request: Request) {
    try {
      const body = await request.json()
      const customerData: JiraCustomerData = {
        displayName: body.displayName,
        email: body.email,
      }
      const result = await createCustomer(customerData)
      return NextResponse.json(result, { status: result.success ? 200 : 400 })
    } catch (error) {
      return NextResponse.json({ success: false, error: (error as Error).message || 'Unknown error' }, { status: 500 })
    }
  }