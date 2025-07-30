// Environment configuration
export const env = {
  // AWS Configuration
  AWS_REGION: process.env.AWS_REGION || 'us-east-1',
  CREATE_TASK_FIELDS_FUNCTION_NAME: process.env.CREATE_TASK_FIELDS_FUNCTION_NAME || 'createTaskFields-dev-agtasks',
  
  // Next.js Configuration
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
  
  // Environment
  NODE_ENV: process.env.NODE_ENV || 'development',
} as const;

// Validate required environment variables
export function validateEnv() {
  const required = [
    'AWS_REGION',
    'CREATE_TASK_FIELDS_FUNCTION_NAME',
  ] as const;
  
  for (const key of required) {
    if (!env[key]) {
      throw new Error(`Missing required environment variable: ${key}`);
    }
  }
} 