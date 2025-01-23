import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";
import { Amplify } from 'aws-amplify';
import outputs from "@/amplify_outputs.json";
import ClientNotifications from '@/components/aws-example'; 

Amplify.configure(outputs);

export default async function NotificationsPage() {
  const client = generateClient<Schema>();
  const { data: projectRoles } = await client.models.ProjectRole.list();

  return (
    <ClientNotifications initialProjectRoles={projectRoles} />
  );
}