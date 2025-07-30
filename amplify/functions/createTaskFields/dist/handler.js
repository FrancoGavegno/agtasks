"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const client_dynamodb_1 = require("@aws-sdk/client-dynamodb");
const lib_dynamodb_1 = require("@aws-sdk/lib-dynamodb");
const client = new client_dynamodb_1.DynamoDBClient({});
const docClient = lib_dynamodb_1.DynamoDBDocumentClient.from(client);
const TABLE_NAME = process.env['TASKFIELD_TABLE'];
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
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
function createTaskFieldItem(input) {
    return {
        taskId: input.taskId,
        fieldId: input.fieldId,
    };
}
async function writeItemWithRetry(item, retryCount = 0) {
    try {
        console.log(`Attempting to write item to table: ${TABLE_NAME}`);
        console.log(`Item to write:`, JSON.stringify(item, null, 2));
        const command = new lib_dynamodb_1.PutCommand({
            TableName: TABLE_NAME,
            Item: item,
        });
        const response = await docClient.send(command);
        console.log(`DynamoDB response:`, JSON.stringify(response, null, 2));
        return true;
    }
    catch (error) {
        console.error(`Write error (attempt ${retryCount + 1}):`, error);
        if (retryCount < MAX_RETRIES) {
            await sleep(RETRY_DELAY_MS * (retryCount + 1));
            return writeItemWithRetry(item, retryCount + 1);
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
        console.log(`Processing ${items.length} items individually`);
        for (let i = 0; i < items.length; i++) {
            const item = items[i];
            console.log(`Processing item ${i + 1}/${items.length}`);
            try {
                const success = await writeItemWithRetry(item, 0);
                if (success) {
                    totalInserted++;
                }
            }
            catch (error) {
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
        let input;
        if (event.arguments?.input) {
            input = event.arguments.input;
        }
        else if (typeof event === 'string') {
            input = JSON.parse(event);
        }
        else if (event.body) {
            input = JSON.parse(event.body);
        }
        else {
            input = event;
        }
        console.log('Parsed input:', JSON.stringify(input, null, 2));
        const result = await processTaskFields(input);
        const statusCode = result.inserted > 0 ? 200 : 400;
        return {
            statusCode,
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