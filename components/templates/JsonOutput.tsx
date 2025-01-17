import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";

interface JsonOutputProps {
  json: any;
}

export default function JsonOutput({ json }: JsonOutputProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>JSON Output</CardTitle>
      </CardHeader>
      <CardContent>
        <pre className="bg-gray-100 p-4 rounded-md overflow-x-auto">
          <code>{json}</code>
        </pre>
      </CardContent>
    </Card>
  )
}

