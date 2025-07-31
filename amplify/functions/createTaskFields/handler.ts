import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb';
import { v4 as uuidv4 } from "uuid";

// Initialize DynamoDB client
const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

// Configuration
const TABLE_NAME = process.env['TASKFIELD_TABLE']!;
const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 1000;

// Types
interface TaskFieldInput {
  taskId: string;
  fieldId: string;
}

interface BatchTaskFieldInput {
  taskFields: TaskFieldInput[];
}

interface TaskFieldItem {
  id: string;
  taskId: string;
  fieldId: string;
  createdAt: string;
  updatedAt: string;
}

interface BatchWriteResult {
  success: boolean;
  inserted: number;
  retries: number;
  createdItems?: TaskFieldItem[] | undefined;
  errors: string[] | undefined;
}

// Validation functions
function validateInput(input: any): input is BatchTaskFieldInput {
  if (!input || typeof input !== 'object') {
    throw new Error('Input must be an object');
  }
  
  if (!Array.isArray(input.taskFields)) {
    throw new Error('taskFields must be an array');
  }
  
  if (input.taskFields.length === 0) {
    throw new Error('taskFields array cannot be empty');
  }
  
  for (const item of input.taskFields) {
    if (!item || typeof item !== 'object') {
      throw new Error('Each taskField must be an object');
    }
    
    if (typeof item.taskId !== 'string' || item.taskId.trim() === '') {
      throw new Error('taskId must be a non-empty string');
    }
    
    if (typeof item.fieldId !== 'string' || item.fieldId.trim() === '') {
      throw new Error('fieldId must be a non-empty string');
    }
  }
  
  return true;
}

// Utility functions
function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function createTaskFieldItem(input: TaskFieldInput): TaskFieldItem {
  const now = new Date().toISOString();
  return {
    id: uuidv4(),
    taskId: input.taskId,
    fieldId: input.fieldId,
    createdAt: now,
    updatedAt: now,
  };
}

// Individual write with retry logic
async function writeItemWithRetry(
  item: TaskFieldItem,
  retryCount = 0
): Promise<boolean> {
  try {
    console.log(`Attempting to write item to table: ${TABLE_NAME}`);
    console.log(`Item to write:`, JSON.stringify(item, null, 2));
    
    const command = new PutCommand({
      TableName: TABLE_NAME,
      Item: item,
    });

    const response = await docClient.send(command);
    console.log(`DynamoDB response:`, JSON.stringify(response, null, 2));
    
    return true;
  } catch (error) {
    console.error(`Write error (attempt ${retryCount + 1}):`, error);
    
    if (retryCount < MAX_RETRIES) {
      await sleep(RETRY_DELAY_MS * (retryCount + 1));
      return writeItemWithRetry(item, retryCount + 1);
    }
    
    throw error;
  }
}

// Main processing function
async function processTaskFields(input: BatchTaskFieldInput): Promise<BatchWriteResult> {
  const startTime = Date.now();
  let totalInserted = 0;
  let totalRetries = 0;
  const errors: string[] = [];
  const createdItems: TaskFieldItem[] = [];

  try {
    // Validate input
    validateInput(input);
    
    // Create items with generated fields
    const items = input.taskFields.map(createTaskFieldItem);
    
    console.log(`Processing ${items.length} items individually`);
    
    // Process each item individually
    for (let i = 0; i < items.length; i++) {
      const item = items[i]!;
      console.log(`Processing item ${i + 1}/${items.length}`);
      
      try {
        const success = await writeItemWithRetry(item, 0);
        if (success) {
          createdItems.push(item);
          totalInserted++;
        }
      } catch (error) {
        const errorMsg = `Failed to process item ${i + 1}: ${error instanceof Error ? error.message : 'Unknown error'}`;
        errors.push(errorMsg);
        console.error(errorMsg);
      }
    }
    
    const duration = Date.now() - startTime;
    console.log(`Completed processing in ${duration}ms. Inserted: ${totalInserted}, Retries: ${totalRetries}`);
    
    return {
      success: errors.length === 0,
      inserted: totalInserted,
      retries: totalRetries,
      createdItems: createdItems.length > 0 ? createdItems : undefined,
      errors: errors.length > 0 ? errors : undefined,
    };
    
  } catch (error) {
    console.error('Processing error:', error);
    return {
      success: false,
      inserted: totalInserted,
      retries: totalRetries,
      createdItems: createdItems.length > 0 ? createdItems : undefined,
      errors: [error instanceof Error ? error.message : 'Unknown error'],
    };
  }
}

// Lambda handler
export const handler = async (event: any): Promise<any> => {
  console.log('Event received:', JSON.stringify(event, null, 2));
  
  try {
    // Extract input from event
    let input;
    
    // Handle different event formats
    if (event.arguments?.input) {
      // GraphQL mutation format
      input = event.arguments.input;
    } else if (typeof event === 'string') {
      // Direct JSON string
      input = JSON.parse(event);
    } else if (event.body) {
      // API Gateway format
      input = JSON.parse(event.body);
    } else {
      // Direct object
      input = event;
    }
    
    console.log('Parsed input:', JSON.stringify(input, null, 2));
    
    // Process the task fields
    const result = await processTaskFields(input);
    
    // Return response
    // Si se insertaron items, consideramos exitoso aunque haya errores
    const statusCode = result.inserted > 0 ? 200 : 400;
    
    return {
      statusCode,
      body: JSON.stringify(result),
      headers: {
        'Content-Type': 'application/json',
      },
    };
    
  } catch (error) {
    console.error('Handler error:', error);
    
    return {
      statusCode: 500,
      body: JSON.stringify({
        success: false,
        inserted: 0,
        retries: 0,
        errors: [error instanceof Error ? error.message : 'Unknown error'],
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    };
  }
}; 