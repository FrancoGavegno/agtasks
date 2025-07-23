import { cookies } from 'next/headers'
import { Task } from "@/lib/interfaces/agtasks"
import {
    getTask,
    getProject,
    listServicesByProject
} from "@/lib/services/agtasks"
import EditTaskStepper from "@/components/task/edit-task-stepper"
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { Link } from "@/i18n/routing"


export default async function TaskPage({ 
    params 
}: { 
    params: { locale: string; domain: string; project: string; task: string } 
}) {
    const cookiesList = cookies();
    const userEmail = cookiesList.get('user-email')?.value || "";
    const taskId = Array.isArray(params.task) ? params.task[0] : params.task;
    const domainId = params.domain;
    const projectId = params.project;
    
    try {
        // Cargar tarea
        const taskData = await getTask(taskId);
        if (!taskData) {
            throw new Error("No se encontró la tarea");
        }

        // Limpiar taskData de funciones para poder pasarlo al cliente
        const cleanTaskData = {
            ...Object.fromEntries(Object.entries(taskData).filter(([_, v]) => typeof v !== 'function')),
            taskFields: Array.isArray(taskData.taskFields) ? taskData.taskFields : []
        } as unknown as Task;

        console.log("Debug - TaskPage taskData.taskFields:", taskData.taskFields)
        console.log("Debug - TaskPage cleanTaskData.taskFields:", cleanTaskData.taskFields)

        // Cargar proyecto
        const projectData = await getProject(taskData.projectId || projectId);
        const cleanProjectData = projectData
            ? Object.fromEntries(Object.entries(projectData).filter(([_, v]) => typeof v !== 'function'))
            : null;

        // Cargar servicios
        const services = await listServicesByProject(projectId);
        const cleanServices = Array.isArray(services)
            ? services.map(s => Object.fromEntries(Object.entries(s).filter(([_, v]) => typeof v !== 'function')))
            : [];

        const projectName = typeof cleanProjectData?.name === 'string' ? cleanProjectData.name : "Proyecto";

        return (
            <div className="container w-full pt-4 pb-4">
                <Breadcrumb className="mb-4">
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <Link href={`/domains/${domainId}/projects/${projectId}/tasks`}>
                                {projectName}
                            </Link>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <Link href={`/domains/${domainId}/projects/${projectId}/tasks`}>Tareas</Link>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbPage>Editar Tarea</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>

                <EditTaskStepper
                    taskData={cleanTaskData}
                    projectName={projectName}
                    services={cleanServices}
                    userEmail={userEmail}
                />
            </div>
        );
    } catch (error) {
        return (
            <div className="min-h-screen bg-background flex flex-col px-4">
                <div className="w-full max-w-6xl mx-auto space-y-6 py-6">
                    <div className="flex items-center gap-4">
                        <Link href={`/domains/${domainId}/projects/${projectId}/tasks`}>
                            <Button variant="ghost" size="sm">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                            </Button>
                        </Link>
                        <div>
                            <h1 className="text-2xl font-bold text-destructive">Error al cargar la tarea</h1>
                            <p className="text-muted-foreground">
                                {error instanceof Error ? error.message : "Error al cargar los datos"}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}