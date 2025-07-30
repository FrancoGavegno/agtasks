"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const client_dynamodb_1 = require("@aws-sdk/client-dynamodb");
const lib_dynamodb_1 = require("@aws-sdk/lib-dynamodb");
const uuid_1 = require("uuid");
const client = new client_dynamodb_1.DynamoDBClient({});
const docClient = lib_dynamodb_1.DynamoDBDocumentClient.from(client);
const TABLE_NAME = process.env['TASKFIELD_TABLE'];
const BATCH_SIZE = 25;
const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 1000;
function validateInput(input) {
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
function chunkArray(array, size) {
    const chunks = [];
    for (let i = 0; i < array.length; i += size) {
        chunks.push(array.slice(i, i + size));
    }
    return chunks;
}
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
function createTaskFieldItem(input) {
    const now = new Date().toISOString();
    return {
        id: (0, uuid_1.v4)(),
        taskId: input.taskId,
        fieldId: input.fieldId,
        createdAt: now,
        updatedAt: now,
    };
}
async function batchWriteWithRetry(items, retryCount = 0) {
    try {
        const command = new lib_dynamodb_1.BatchWriteCommand({
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
        const unprocessedItems = [];
        const unprocessedRequests = response.UnprocessedItems[TABLE_NAME] || [];
        for (const request of unprocessedRequests) {
            if (request.PutRequest?.Item) {
                unprocessedItems.push(request.PutRequest.Item);
            }
        }
        return { processed: items.length - unprocessedItems.length, unprocessed: unprocessedItems };
    }
    catch (error) {
        console.error(`Batch write error (attempt ${retryCount + 1}):`, error);
        if (retryCount < MAX_RETRIES) {
            await sleep(RETRY_DELAY_MS * (retryCount + 1));
            return batchWriteWithRetry(items, retryCount + 1);
        }
        throw error;
    }
}
async function processTaskFields(input) {
    const startTime = Date.now();
    let totalInserted = 0;
    let totalRetries = 0;
    const errors = [];
    try {
        validateInput(input);
        const items = input.taskFields.map(createTaskFieldItem);
        const chunks = chunkArray(items, BATCH_SIZE);
        console.log(`Processing ${items.length} items in ${chunks.length} chunks`);
        for (let i = 0; i < chunks.length; i++) {
            const chunk = chunks[i];
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
                }
                else {
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
    }
    catch (error) {
        console.error('Processing error:', error);
        return {
            success: false,
            inserted: totalInserted,
            retries: totalRetries,
            errors: [error instanceof Error ? error.message : 'Unknown error'],
        };
    }
}
const handler = async (event) => {
    console.log('Event received:', JSON.stringify(event, null, 2));
    try {
        const input = event.arguments?.input || event;
        const result = await processTaskFields(input);
        return {
            statusCode: result.success ? 200 : 400,
            body: JSON.stringify(result),
            headers: {
                'Content-Type': 'application/json',
            },
        };
    }
    catch (error) {
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
exports.handler = handler;
//# sourceMappingURL=handler.js.map