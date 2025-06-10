"use client"

import {
    useEffect,
    useState
} from "react"
import { useParams } from "next/navigation"
import type { FieldSchema } from "@/components/dynamic-form/types"
import { ServiceTask } from "@/lib/interfaces"
import { getTask } from "@/lib/services/agtasks"
import { DynamicForm } from "@/components/dynamic-form/dynamic-form"
import { convertJSONSchemaToFields, isJSONSchema } from "@/components/dynamic-form/utils"
import { toast } from "@/hooks/use-toast"

export default function TaskPage() {
    // http://localhost:3000/es/domains/8644/projects/1127f7f0-f21e-4825-b4fd-78dd3344e189/tasks/e4d26f05-96a7-4405-92b7-4e6ea20d6f7e
    const params = useParams()
    const { task } = params
    const [loadedSchema, setLoadedSchema] = useState<FieldSchema[] | null>(null)
    const [isLoadingSchema, setIsLoadingSchema] = useState(true)
    const [errorSchema, setErrorSchema] = useState<string | null>(null)
    const [taskData, setTaskData] = useState<ServiceTask>()

    useEffect(() => {
        async function fetchTask(task: string) {
            const taskData = await getTask(task)
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

                const response = await fetch(`/schemas/${formType}.json`)
                if (!response.ok) {
                    throw new Error(`Error al cargar el esquema: ${response.status} ${response.statusText}`)
                }

                const rawData = await response.json()
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

    const handleSubmit = (data: Record<string, any>) => {
        console.log("Datos del formulario:", data)
        toast({
            title: "Formulario enviado!",
            description: "Revisa la consola.",
            duration: 5000,
        });
    }

    const initialFormValues = {
        tipo: "Aplicación",
        responsable: "usuario1@gmail.com",
        contratista: "usuario2@gmail.com",
        comoLlegar: "https://maps.google.com/example",
        mapaDeFondo: "https://example.com/map.png",
        insumos: [
            {
                insumo: "Insumo 1",
                dosis: 10,
                unidad: "Kg/Ha",
                hectareas: 25,
            },
        ],
    }

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
                    initialData={initialFormValues}
                    submitButtonText="Guardar Formulario"
                    className="bg-card p-6 sm:p-8 shadow-xl rounded-xl border"
                />
            </div>
        </div>
    )
}
