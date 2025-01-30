"use client"

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import {
  MoreHorizontal,
  Calendar,
  AlertCircle,
  Flag
} from "lucide-react";
import { getTasks } from "@/lib/clickup";
import { Link } from "@/i18n/routing";
import { capitalizeFirstLetter } from "@/lib/utils";
import { Task } from "@/lib/interfaces";

export default function TaskList() {
  const { id } = useParams();
  const projectId = Array.isArray(id) ? id[0] : id;
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const tasksData = await getTasks(projectId);
        // setTasks(tasksData);

        const sortedTasks: Task[] = tasksData.sort((a: Task, b: Task) => parseFloat(a.orderindex) - parseFloat(b.orderindex));
        setTasks(sortedTasks);

      } catch (error) {
        console.error('Error fetching tasks:', error)
      } finally {
        setIsLoading(false);
      }
    }

    fetchTasks()
  }, [])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric'
    })
  }

  if (isLoading) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardContent className="p-6">
          <div className="flex justify-center items-center h-40">
            <p className="text-lg text-muted-foreground">Cargando tareas...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Tareas </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {tasks.map((task, index) => (
          <div key={task.id}>
            {index > 0 && <Separator className="my-4" />}
            <div className="flex items-start justify-between group">
              <div className="flex-grow space-y-2 mr-4 min-w-0">
                <h3 className="text-sm font-bold truncate max-w-[calc(100%-2rem)]" title={task.name}>{task.name}</h3>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mt-2 w-full">
                  <div className="flex items-center justify-start text-sm text-muted-foreground">
                    <Calendar className="mr-2 h-4 w-4" />
                    <span>{formatDate(task.due_date)}</span>
                  </div>
                  <div className="flex items-center justify-start text-sm text-muted-foreground">
                    <AlertCircle className="mr-2 h-4 w-4" />
                    <span style={{ color: task.status?.color }}>{capitalizeFirstLetter(task.status?.status || '')}</span>
                  </div>
                  <div className="flex items-center justify-start text-sm text-muted-foreground">
                    <Flag className="mr-2 h-4 w-4" />
                    <span>{capitalizeFirstLetter(task.priority?.priority || '')}</span>
                  </div>
                  <div className="flex items-center justify-start text-sm text-muted-foreground">
                    <span>{task.custom_item_id}</span>
                  </div>
                </div>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-8 w-8 p-0">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>
                    Actions
                  </DropdownMenuLabel>
                  <DropdownMenuItem>
                    <Link
                      href={`/task/${task.id}/edit/${task.custom_item_id}`}
                    >Edit
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

