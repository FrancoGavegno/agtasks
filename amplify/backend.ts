import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource';
import { data } from './data/resource';

defineBackend({
  auth,
  data,
}, {
  name: 'agtasks-backend',
  region: 'us-east-1'
});
