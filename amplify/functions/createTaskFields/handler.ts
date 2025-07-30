import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, BatchWriteCommand } from '@aws-sdk/lib-dynamodb';
import { v4 as uuidv4 } from 'uuid';

// Initialize DynamoDB client
const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

// Configuration
const TABLE_NAME = process.env['TASKFIELD_TABLE']!;
const BATCH_SIZE = 25;
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
function chunkArray<T>(array: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
}

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

// Batch write with retry logic
async function batchWriteWithRetry(
  items: TaskFieldItem[],
  retryCount = 0
): Promise<{ processed: number; unprocessed: TaskFieldItem[] }> {
  try {
    const command = new BatchWriteCommand({
      RequestItems: {
        [TABLE_NAME]: items.map(item => ({
          PutRequest: {
            Item: item,
          },
        })),
      },
    });

    const response = await docClient.send(command);
    
    if (!response.UnprocessedItems || Object.keys(response.UnprocessedItems).length === 0) {
      return { processed: items.length, unprocessed: [] };
    }

    const unprocessedItems: TaskFieldItem[] = [];
    const unprocessedRequests = response.UnprocessedItems[TABLE_NAME] || [];
    
    for (const request of unprocessedRequests) {
      if (request.PutRequest?.Item) {
        unprocessedItems.push(request.PutRequest.Item as TaskFieldItem);
      }
    }

    return { processed: items.length - unprocessedItems.length, unprocessed: unprocessedItems };
  } catch (error) {
    console.error(`Batch write error (attempt ${retryCount + 1}):`, error);
    
    if (retryCount < MAX_RETRIES) {
      await sleep(RETRY_DELAY_MS * (retryCount + 1));
      return batchWriteWithRetry(items, retryCount + 1);
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

  try {
    // Validate input
    validateInput(input);
    
    // Create items with generated fields
    const items = input.taskFields.map(createTaskFieldItem);
    
    // Split into chunks
    const chunks = chunkArray(items, BATCH_SIZE);
    
    console.log(`Processing ${items.length} items in ${chunks.length} chunks`);
    
    // Process each chunk
    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i]!;
      console.log(`Processing chunk ${i + 1}/${chunks.length} with ${chunk.length} items`);
      
      let unprocessedItems = chunk;
      let retryCount = 0;
      
      while (unprocessedItems.length > 0 && retryCount < MAX_RETRIES) {
        const result = await batchWriteWithRetry(unprocessedItems, retryCount);
        totalInserted += result.processed;
        
        if (result.unprocessed.length > 0) {
          retryCount++;
          totalRetries++;
          unprocessedItems = result.unprocessed;
          console.log(`Retry ${retryCount}: ${unprocessedItems.length} items remaining`);
        } else {
          break;
        }
      }
      
      if (unprocessedItems.length > 0) {
        const errorMsg = `Failed to process ${unprocessedItems.length} items in chunk ${i + 1} after ${MAX_RETRIES} retries`;
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
      errors: errors.length > 0 ? errors : undefined,
    };
    
  } catch (error) {
    console.error('Processing error:', error);
    return {
      success: false,
      inserted: totalInserted,
      retries: totalRetries,
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
    return {
      statusCode: result.success ? 200 : 400,
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