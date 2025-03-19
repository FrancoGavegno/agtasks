// components/protocols/protocol-detail.tsx
import { getIssue } from "@/lib/jira"; // Ajusta la ruta según tu estructura
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

type JiraSubtask = {
  key: string;
  fields: {
    summary: string;
    status: {
      name: string;
    };
  };
};

type ProtocolDetailProps = {
  id: string;
};

export default async function ProtocolDetail({ id }: ProtocolDetailProps) {
  const result = await getIssue(id);

  if (!result.success) {
    return (
      <div className="container mx-auto py-10">
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{result.error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  const issueData = result.data;
  const subtasks: JiraSubtask[] = issueData.fields.subtasks || [];

  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle>
            Subtasks for Issue {id}
            <Badge className="ml-2" variant="outline">
              {issueData.fields.status.name}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {subtasks.length === 0 ? (
            <p className="text-muted-foreground">No subtasks found for this issue.</p>
          ) : (
            <ul className="space-y-4">
              {subtasks.map((subtask) => (
                <li key={subtask.key} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{subtask.key}</p>
                    <p className="text-sm text-muted-foreground">{subtask.fields.summary}</p>
                  </div>
                  <Badge variant={subtask.fields.status.name === "Done" ? "default" : "secondary"}>
                    {subtask.fields.status.name}
                  </Badge>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}