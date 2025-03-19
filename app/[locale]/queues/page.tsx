import { fetchJiraQueues } from '@/lib/jira';

interface JiraQueue {
  id: string;
  name: string;
  jql: string;
  issueCount: number;
}

interface JiraQueuesResponse {
  size: number;
  start: number;
  limit: number;
  isLastPage: boolean;
  values: JiraQueue[];
}

export default async function Home() {
  // Fetch queues directly on the server
  const queues = await fetchJiraQueues("DAT", "prod"); // Adjust serviceDeskId and env as needed

  if (!queues) {
    return <div>Error: Failed to fetch queues from Jira</div>;
  }

  return (
    <div>
      <h1>Jira Service Desk Queues</h1>
      <p>Queue Count: {queues.size}</p>
      <p>Is Last Page: {queues.isLastPage.toString()}</p>
      <ul>
        {queues.values.map((queue) => (
          <li key={queue.id}>
            {queue.name} - Issues: {queue.issueCount}
          </li>
        ))}
      </ul>
    </div>
  );
}