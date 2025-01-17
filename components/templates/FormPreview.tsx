import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { FormType, TaskType, FieldType } from "@/lib/interfaces";

interface FormPreviewProps {
  formType: FormType;
  tasks: TaskType[];
  taskFields: { [key: string]: FieldType[] };
}

export default function FormPreview({ formType, tasks, taskFields }: FormPreviewProps) {
  if (!formType) return null

  return (
    <Card>
      <CardHeader>
        <CardTitle>Form Preview</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">{formType.title}</h3>
          <p className="text-sm text-muted-foreground">{formType.description}</p>
        </div>
        
        {tasks.length > 0 && (
          <div className="space-y-4">
            <h4 className="font-medium">Selected Tasks:</h4>
            <ul className="space-y-4">
              {tasks.map((task) => (
                <li key={task.taskId} className="space-y-2">
                  <p className="font-medium">{task.taskName}</p>
                  {Array.isArray(taskFields[task.taskId]) && taskFields[task.taskId].length > 0 ? (
                    <ul className="ml-4 space-y-1">
                      {taskFields[task.taskId].map((field) => (
                        <li key={field.name} className="text-sm text-muted-foreground">
                          {field.label} ({field.type})
                          {field.required && " *"}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-muted-foreground ml-4">No fields selected</p>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}
        
        {tasks.length === 0 && (
          <p className="text-sm text-muted-foreground">No tasks selected</p>
        )}
      </CardContent>
    </Card>
  )
}

