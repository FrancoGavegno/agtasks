import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource';
import { data } from './data/resource';
import { createTaskFields } from './functions/createTaskFields/resource';

defineBackend({
  auth,
  data,
  createTaskFields,
});
