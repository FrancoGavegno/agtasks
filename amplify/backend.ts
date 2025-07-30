import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource.js';
import { data } from './data/resource.js';
import { createTaskFields } from './functions/createTaskFields/resource.js';

defineBackend({
  auth,
  data,
  createTaskFields,
});
