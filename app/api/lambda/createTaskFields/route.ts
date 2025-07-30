import { NextRequest, NextResponse } from 'next/server';
import { LambdaClient, InvokeCommand } from '@aws-sdk/client-lambda';

const lambda = new LambdaClient({
  region: process.env.AWS_REGION,
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validar que tenemos los datos necesarios
    if (!body.taskFields || !Array.isArray(body.taskFields)) {
      return NextResponse.json(
        { 
          success: false,
          inserted: 0,
          retries: 0,
          errors: ['Invalid input: taskFields array is required']
        },
        { status: 400 }
      );
    }

    console.log(`API Route: Processing ${body.taskFields.length} task fields`);

    // Preparar el comando para invocar la Lambda
    const command = new InvokeCommand({
      FunctionName: process.env.CREATE_TASK_FIELDS_FUNCTION_NAME!,
      Payload: JSON.stringify(body),
    });

    // Invocar la función Lambda
    const response = await lambda.send(command);
    
    if (response.StatusCode !== 200) {
      throw new Error(`Lambda invocation failed with status: ${response.StatusCode}`);
    }

    // Parsear la respuesta de la Lambda
    const payload = JSON.parse(new TextDecoder().decode(response.Payload));
    
    console.log(`API Route: Lambda response:`, payload);
    
    return NextResponse.json(payload);
    
  } catch (error) {
    console.error('Error invoking Lambda function:', error);
    return NextResponse.json(
      { 
        success: false, 
        inserted: 0, 
        retries: 0, 
        errors: [error instanceof Error ? error.message : 'Unknown error'] 
      },
      { status: 500 }
    );
  }
} 