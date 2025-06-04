"use client"

import { useEffect, useState } from "react"
import { DynamicForm } from "@/components/dynamic-form/dynamic-form"
import type { FieldSchema } from "@/components/dynamic-form/types"
import { useParams } from "next/navigation"
import { ServiceTask } from "@/lib/interfaces"
import { getTask } from "@/lib/services/agtasks"

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
                const response = await fetch("/schemas/crear_puntos_recorrida.json")
                //const response = await fetch("/schemas/crear_puntos_recorrida.json") // Carga desde public
                if (!response.ok) {
                    throw new Error(`Error al cargar el esquema: ${response.status} ${response.statusText}`)
                }
                const schemaData = await response.json()
                setLoadedSchema(schemaData)
            } catch (error) {
                console.error("Error fetching schema:", error)
                setErrorSchema(error instanceof Error ? error.message : "Error desconocido al cargar el esquema.")
            } finally {
                setIsLoadingSchema(false)
            }
        }
        fetchSchema()
    }, [])

    const handleSubmit = (data: Record<string, any>) => {
        console.log("Datos del formulario de visita:", data)
        alert("Formulario de visita enviado! Revisa la consola.")
    }

    // Datos iniciales opcionales, deben coincidir con los nombres del nuevo esquema
    // const initialFormValues = {
    //     establecimiento: "DS_Bossio",
    //     // 'lote' se llenará dinámicamente basado en 'establecimiento',
    //     // pero si DS_Bossio tiene un lote por defecto, podría ponerse aquí.
    //     // lote: "Lote 1A",
    //     tipoRecorridas: "Control Emergencia",
    //     asignadoA: "Franco Gavegno",
    //     fecha: "2024-07-20", // Formato YYYY-MM-DD para que parseISO funcione
    //     estado: "Planificado",
    //     mapaFondoURL: "https://example.com/map.png",
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
            <div className="min-h-screen bg-background flex flex-col items-center justify-center py-8 px-4">
                <p className="text-xl text-destructive">Error: {errorSchema}</p>
                <p className="text-sm text-muted-foreground">
                    Asegúrate que el archivo <code>public/schemas/field_visit.json</code> existe y es accesible.
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
            <div className="w-full max-w-3xl">
                <h1 className="text-3xl font-bold mb-8 text-center text-foreground">
                    {taskData && taskData.taskName}
                </h1>
                <DynamicForm
                    schema={loadedSchema}
                    onSubmit={handleSubmit}
                    //initialData={initialFormValues}
                    submitButtonText="Guardar"
                    className="bg-card p-6 sm:p-8 shadow-xl rounded-xl border"
                />
            </div>
        </div>
    )
}
