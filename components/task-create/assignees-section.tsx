import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"

interface Assignee {
  id: string
  name: string
  email: string
  avatar?: string
}

interface AssigneesSectionProps {
  assignees: string[]
  onChange: (assignees: string[]) => void
}

const MOCK_ASSIGNEES: Assignee[] = [
  { id: "1", name: "Lesley Pohl", email: "lesleypohl@hotmail.com" },
  { id: "2", name: "Digital Farming Canada", email: "canada@xarvio.com" },
  { id: "3", name: "Gregor Zink", email: "gregor.zink@farm.com" },
  { id: "4", name: "Prod Test User", email: "tester@pokemail.net" },
]

export function AssigneesSection({ assignees, onChange }: AssigneesSectionProps) {
  const toggleAssignee = (id: string) => {
    if (assignees.includes(id)) {
      onChange(assignees.filter((a) => a !== id))
    } else {
      onChange([...assignees, id])
    }
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Assign To User/s</h2>
      
      <Input
        type="search"
        placeholder="Search assignees..."
        className="w-full"
      />

      <ScrollArea className="h-[300px] border rounded-lg">
        <div className="p-4 space-y-2">
          {MOCK_ASSIGNEES.map((assignee) => (
            <div
              key={assignee.id}
              className="flex items-center justify-between p-2 hover:bg-accent rounded-lg"
            >
              <div className="flex items-center space-x-4">
                <Checkbox
                  checked={assignees.includes(assignee.id)}
                  onCheckedChange={() => toggleAssignee(assignee.id)}
                />
                <Avatar>
                  <AvatarFallback>
                    {assignee.name.split(" ").map(n => n[0]).join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">{assignee.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {assignee.email}
                  </div>
                </div>
              </div>
              <Button size="sm">Assign</Button>
            </div>
          ))}
        </div>
      </ScrollArea>

      <div className="pt-4 border-t">
        <Label htmlFor="new-assignee">Add new assignee</Label>
        <Input
          id="new-assignee"
          placeholder="Enter name for record keeping"
          className="mt-2"
        />
      </div>
    </div>
  )
}

