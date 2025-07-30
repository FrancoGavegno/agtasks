import { defineFunction } from '@aws-amplify/backend';

export const createTaskFields = defineFunction({
  name: 'createTaskFields',
  entry: './handler.ts',
  timeoutSeconds: 900, // 15 minutes for large batches
  memoryMB: 1024,
  environment: {
    TASKFIELD_TABLE: 'TaskField-edyzenrmzvdgnoom3qe2772a3u-NONE',
    LOG_LEVEL: 'INFO',
  },
}); 