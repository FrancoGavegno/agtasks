import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export function Tasks() {
  return (
    <div className="flex items-center justify-center py-12">
      <Alert className="max-w-md">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Coming soon</AlertTitle>
        <AlertDescription>
          The tasks management feature is currently under development and will be available soon.
        </AlertDescription>
      </Alert>
    </div>
  )
}
