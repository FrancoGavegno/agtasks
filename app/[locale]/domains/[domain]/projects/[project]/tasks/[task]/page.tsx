"use client"

import {
    useEffect,
    useState
} from "react"
import { useParams } from "next/navigation"
import type { FieldSchema } from "@/components/dynamic-form/types"
import { ServiceTask } from "@/lib/interfaces"
import { 
    getServiceTask,
    updateServiceTask
} from "@/lib/services/agtasks"
import { DynamicForm } from "@/components/dynamic-form/dynamic-form"
import { 
    convertJSONSchemaToFields, 
    isJSONSchema 
} from "@/components/dynamic-form/utils"
import { toast } from "@/hooks/use-toast"

export default function TaskPage() {
    const params = useParams()
    const { locale, task } = params
    const [loadedSchema, setLoadedSchema] = useState<FieldSchema[] | null>(null)
    const [isLoadingSchema, setIsLoadingSchema] = useState(true)
    const [errorSchema, setErrorSchema] = useState<string | null>(null)
    const [taskData, setTaskData] = useState<ServiceTask>()

    useEffect(() => {
        async function fetchTask(task: string) {
            const taskData = await getServiceTask(task)

            console.log("taskData: ", taskData)
            setTaskData(taskData)
        }

        fetchTask(Array.isArray(task) ? task[0] : task)
    }, [task])

    useEffect(() => {
        async function fetchSchema() {
            try {
                setIsLoadingSchema(true)
                setErrorSchema(null)

                // console.log("taskData: ", taskData)
                // console.log("taskType: ", taskData?.taskType)
                let formType = taskData?.taskType || "administrative"

                const response = await fetch(`/schemas/${formType}-${locale}-1.json`)
                if (!response.ok) {
                    throw new Error(`Error al cargar el esquema: ${response.status} ${response.statusText}`)
                }

                const rawData = await response.json()
                // const rawData = taskData?.formSchema; 

                if (!isJSONSchema(rawData)) {
                    throw new Error("El archivo debe seguir el formato JSON Schema estándar")
                }

                const convertedSchema = await convertJSONSchemaToFields(rawData)
                setLoadedSchema(convertedSchema)
            } catch (error) {
                console.error("Error fetching schema:", error)
                setErrorSchema(error instanceof Error ? error.message : "Error desconocido al cargar el esquema.")
            } finally {
                setIsLoadingSchema(false)
            }
        }
        fetchSchema()
    }, [taskData])

    const handleSubmit = async (data: Record<string, any>) => {
        try {
            // console.log("task: ", task)
            // console.log("data: ", data)

            const response = await updateServiceTask(task as string, data);

            if (!response.success) {
                toast({
                    title: "Error al enviar el formulario",
                    description: response.error ? response.error.toString() : "Ocurrió un error al intentar actualizar la tarea.",
                    duration: 5000,
                    variant: "destructive",
                });
                return;
            }

            toast({
                title: "Formulario enviado!",
                description: "Revisa la consola.",
                duration: 5000,
            });
        } catch (error) {
            console.error("Error en handleSubmit:", error);
            toast({
                title: "Error inesperado",
                description: error instanceof Error ? error.message : "Ocurrió un error inesperado al enviar el formulario.",
                duration: 5000,
                variant: "destructive",
            });
        }
    }

    // const initialFormValues = {
    //     tipo: "Aplicación",
    //     responsable: "usuario1@gmail.com",
    //     contratista: "usuario2@gmail.com",
    //     comoLlegar: "https://maps.google.com/example",
    //     mapaDeFondo: "https://example.com/map.png",
    //     insumos: [
    //         {
    //             insumo: "Insumo 1",
    //             dosis: 10,
    //             unidad: "Kg/Ha",
    //             hectareas: 25,
    //         },
    //     ],
    // }

    if (isLoadingSchema) {
        return (
            <div className="min-h-screen bg-background flex flex-col items-center justify-center py-8 px-4">
                <p className="text-xl text-foreground">Cargando esquema del formulario...</p>
            </div>
        )
    }

    if (errorSchema) {
        return (
            <div className="min-h-screen bg-background flex flex-col items-center justify-center py-8 px-4 space-y-4">
                <p className="text-xl text-destructive">Error: {errorSchema}</p>
                <p className="text-sm text-muted-foreground text-center max-w-md">
                    El archivo debe seguir el formato JSON Schema estándar con propiedades como `type`, `properties`, etc.
                </p>
            </div>
        )
    }

    if (!loadedSchema) {
        return (
            <div className="min-h-screen bg-background flex flex-col items-center justify-center py-8 px-4">
                <p className="text-xl text-foreground">No se pudo cargar el esquema del formulario.</p>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-background flex flex-col items-center py-8 px-4">
            <div className="w-full max-w-4xl">
                <h1 className="text-3xl font-bold mb-8 text-center text-foreground">
                    {taskData?.taskName}
                </h1>

                <DynamicForm
                    schema={loadedSchema}
                    onSubmit={handleSubmit}
                    //initialData={initialFormValues}
                    submitButtonText="Guardar Formulario"
                    className="bg-card p-6 sm:p-8 shadow-xl rounded-xl border"
                />
            </div>
        </div>
    )
}
