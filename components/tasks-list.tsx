"use client"

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
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
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { 
  MoreVertical, 
  Calendar, 
  AlertCircle, 
  Flag 
} from "lucide-react";
import { getTasks } from "@/lib/clickup";
import { Link } from "@/i18n/routing";

interface Task {
  id: string
  name: string
  custom_item_id?: number
  due_date: string
  status?: {
    color: string
    id: string
    orderindex: number
    status: string
    type: string    
  }
  priority?: {
    color: string
    id: string
    orderindex: string
    priority: string
  }
}

export default function TaskList() {
  const { id } = useParams();
  const projectId = Array.isArray(id) ? id[0] : id;
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const tasksData = await getTasks(projectId);
        //console.log("tasksData:", tasksData);
        setTasks(tasksData);
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
      month: 'long',
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
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-2 w-full">
                  <div className="flex items-center justify-start text-sm text-muted-foreground">
                    <Calendar className="mr-2 h-4 w-4" />
                    <span>{formatDate(task.due_date)}</span>
                  </div>
                  <div className="flex items-center justify-start text-sm">
                    <AlertCircle className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span style={{color: task.status?.color}}>{task.status?.status}</span>
                  </div>
                  <div className="flex items-center justify-start text-sm">
                    <Flag className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span>{task.priority?.priority}</span>
                    <span>{task.custom_item_id}</span>
                  </div>
                </div>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger className="opacity-0 group-hover:opacity-100 focus:opacity-100">
                  <MoreVertical className="h-5 w-5 text-muted-foreground" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
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

