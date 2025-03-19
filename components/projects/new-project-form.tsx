"use client"

import type React from "react"
import { useState } from "react"
//import { useRouter } from "next/navigation"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { X, Trash2 } from "lucide-react"
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger
} from "@/components/ui/accordion"
import { useToast } from "@/hooks/use-toast"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import type { AssignedUser, JiraRequestData, Lote } from "@/lib/interfaces"
import { createRequest, } from "@/lib/jira"


const getFieldsByFarm = (farm: string): Lote[] => {
    if (farm === "otono") {
        return [
            {
                id: "233891",
                lote: "O1",
                cultivo: "Soja:DM 60I62 IPRO",
                hectareas: 48.348,
            },
            {
                id: "233892",
                lote: "O2",
                cultivo: "Soja:DM 60I62 IPRO",
                hectareas: 12.747,
            },
            {
                id: "233893",
                lote: "O3",
                cultivo: "Soja:DM 60I62 IPRO",
                hectareas: 14.919,
            },
        ]
    }
    return []
}

const protocols = {
    "monitoreo-malezas": {
        name: "Monitoreo satelital y control de malezas",
        tasks: [
            {
                title: "Monitoreo satelital inicial",
                description: "Analizar imágenes satelitales con el fin de detectar presencia de malezas en el lote",
            },
            {
                title: "Zonificación del índice",
                description:
                    "Generar el mapa de Zonas por índice a partir de la imagen satelital seleccionada en el paso anterior",
            },
            {
                title: "Validación del mapa de zonas con recorrida a campo",
                description:
                    "Se navega a campo el mapa de zonas por índice para validar que el mismo se adecua a la realidad del lote",
            },
            {
                title: "Confección de la prescripción",
                description: "Usando como base el Mapa de Zonas por índice validado previamente se confecciona la prescripción",
            },
            {
                title: "Generar reporte de prescripción",
                description:
                    "Se genera el reporte de prescripción que tiene de manera ordenada un resumen de las dosis a aplicar en cada zona del lote",
            },
            {
                title: "Exportar prescripción",
                description:
                    "Se exporta la prescripción generada y se envía la misma al John Deere Operations Center en caso que disponga de esta cuenta en dicha plataforma",
            },
            {
                title: "Control satelital post-aplicación",
                description:
                    "Evaluamos el efecto de la aplicación de herbicida utilizando el reporte de TSIA de campos y diferencias",
            },
            {
                title: "Control de calidad de aplicación",
                description: "En base al mapa de aplicación obtenido analizaremos la calidad de la labor",
            },
            {
                title: "Análisis de índice vs prescripción de herbicida",
                description:
                    "Cruzaremos estas capas de información para demostrar que la eficiencia en el control de malezas no afecta el rendimiento del cultivo",
            },
        ],
    },
    "siembra-fertilizacion": {
        name: "Siembra y/o Fertilización Variable",
        tasks: [
            {
                title: "Generar Mapa de Productividad",
                description: "Generar Mapa de Productividad para identificar y analizar la variabilidad dentro del lote",
            },
            {
                title: "Validar Mapa de Productividad",
                description: "Validar Mapa de Productividad para asegurarnos que se adecua a la realidad del lote",
            },
            {
                title: "Generar prescripción",
                description: "Generar Mapa de Prescripción a partir de un Mapa de Productividad",
            },
            {
                title: "Plantear ensayos",
                description: "Generar ensayos usando la herramienta QGIS",
            },
            {
                title: "Generar Reporte de Prescripción",
                description:
                    "Generar Reporte de Prescripción el cual sirve como punto de partida para realizar la aplicación variable dentro del lote",
            },
            {
                title: "Exportar prescripción",
                description:
                    "Exportar Mapa de Prescripción desde Campo 360 usando DataCore o enviarla misma al John Deere Operations Center",
            },
            {
                title: "Procesar Mapa de Aplicación",
                description:
                    "Una vez finalizada la aplicación variable, el mapa de aplicación estará disponible. En esta tarea encontrarás las distintas opciones para procesarlo e importarlo a la plataforma",
            },
            {
                title: "Generar reporte de labores y de calidad de aplicación",
                description:
                    "Generar Reporte de Aplicación y de Prescripción vs Aplicación. Ambos nos brindan información valiosa para que podamos analizar la calidad de la labor",
            },
            {
                title: "Monitoreo satelital para seguimiento de cultivo",
                description: "Analizar imágenes satelitales para darle seguimiento a los lotes y ensayos",
            },
            {
                title: "Procesar Mapa de Rendimiento",
                description:
                    "Una vez finalizada la cosecha de cultivo, el mapa de rindes estará disponible. En esta tarea encontrarás las distintas opciones para procesarlo e importarlo a la plataforma 360",
            },
            {
                title: "Análisis de rinde por área",
                description:
                    "Cruzar el mapa de rindes procesado en la tarea anterior, con la prescripción de siembra/fertilización correspondiente para evaluar el manejo realizado y obtener conclusiones",
            },
        ],
    },
}

const availableUsers = [{ email: "fgavegno@geoagro.com" }, { email: "francogavegno@gmail.com" }]

const availableRoles = ["Supervisor", "Colector", "Operador GIS"]

export default function NewProjectForm() {

    const { toast } = useToast()
    //const router = useRouter()
    const initialFormData = {
        domain: "",
        area: "",
        workspace: "",
        campaign: "",
        farm: "",
        protocol: "",
        dueDate: "",
    }
    // const initialFormData = {
    //     domain: "geoagro",
    //     area: "area1",
    //     workspace: "aarcas",
    //     campaign: "jun22-jul23",
    //     farm: "otono",
    //     protocol: "monitoreo-malezas",
    //     dueDate: "",
    // }

    const [formData, setFormData] = useState(initialFormData)
    const [participants, setParticipants] = useState<string[]>([])
    const [emailInput, setEmailInput] = useState("")
    const [selectedLots, setSelectedLots] = useState<string[]>([])
    // const [assignedUsers, setAssignedUsers] = useState<AssignedUser[]>([])
    // const [newUser, setNewUser] = useState<AssignedUser>({ email: "", role: "" })

    const isValidEmail = (email: string) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    }

    const handleEmailKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            e.preventDefault()
            if (emailInput && isValidEmail(emailInput)) {
                if (!participants.includes(emailInput)) {
                    setParticipants([...participants, emailInput])
                    setEmailInput("")
                }
            } else {
                toast({
                    variant: "destructive",
                    title: "Email inválido",
                    description: "Por favor ingrese una dirección de email válida",
                })
            }
        }
    }

    const removeEmail = (emailToRemove: string) => {
        setParticipants(participants.filter((email) => email !== emailToRemove))
    }

    const toggleLote = (lotId: string) => {
        setSelectedLots((current) => (current.includes(lotId) ? current.filter((id) => id !== lotId) : [...current, lotId]))
    }

    const toggleAll = () => {
        setSelectedLots((current) =>
            current.length === getFieldsByFarm(formData.farm).length
                ? []
                : getFieldsByFarm(formData.farm).map((lot) => lot.id),
        )
    }

    // const addAssignedUser = () => {
    //     if (newUser.email && newUser.role) {
    //         setAssignedUsers([...assignedUsers, newUser])
    //         setNewUser({ email: "", role: "" })
    //     }
    // }

    // const removeAssignedUser = (index: number) => {
    //     setAssignedUsers(assignedUsers.filter((_, i) => i !== index))
    // }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!Object.values(formData).every((value) => value)) {
            toast({
                variant: "destructive",
                title: "Error",
                description: "Por favor complete todos los campos requeridos",
            })
            return
        }

        if (selectedLots.length === 0) {
            toast({
                variant: "destructive",
                title: "Error",
                description: "Por favor seleccione al menos un lote",
            })
            return
        }

        // if (participants.length === 0) {
        //     toast({
        //         variant: "destructive",
        //         title: "Error",
        //         description: "Por favor ingrese al menos un email para notificaciones",
        //     })
        //     return
        // }

        // if (assignedUsers.length === 0) {
        //     toast({
        //         variant: "destructive",
        //         title: "Error",
        //         description: "Por favor asigne al menos un usuario al proyecto",
        //     })
        //     return
        // }

        const selectedProtocol = protocols[formData.protocol as keyof typeof protocols]

        const jiraRequestData: JiraRequestData = {
            //email: emails[0], // Using the first email as the primary contact
            email: "fgavegno@geoagro.com", // Using the first email as the primary contact
            request: selectedProtocol.name,
            domain: formData.domain,
            area: formData.area,
            workspace: formData.workspace,
            season: formData.campaign,
            farm: formData.farm,
            date_requested: new Date().toISOString(),
            date_limit: formData.dueDate,
            //reason: "Proyecto de monitoreo", // You might want to add a field for this in the form
            //objective: "Realizar tareas de monitoreo y control", // You might want to add a field for this in the form
            //comments: "Proyecto creado desde la aplicación web", // You might want to add a field for this in the form
            // participants: assignedUsers.map((user) => user.email),
            participants: participants,
        }

        //const result = await createJiraIssue(jiraRequestData, jiraFields, "es", "prod")
        const result = await createRequest(jiraRequestData, "es", "prod")
        //const result = await createCustomer("prod"); // Use "test" for test environment if needed

        if (result) {
            toast({
                title: "Proyecto iniciado con éxito",
                description:
                    "Se han configurado todas las tareas del proyecto.",
            })

            // Reset form state
            setFormData({
                domain: "",
                area: "",
                workspace: "",
                campaign: "",
                farm: "",
                protocol: "",
                dueDate: "",
            })
            setSelectedLots([])
            //setAssignedUsers([])
            setParticipants([])
            setEmailInput("")
        } else {
            toast({
                variant: "destructive",
                title: "Error",
                description: "Hubo un problema al crear el ticket en Jira. Por favor, inténtelo de nuevo.",
            })
        }
    }

    const selectedProtocol = formData.protocol ? protocols[formData.protocol as keyof typeof protocols] : null

    return (
        <div className="container mx-auto py-6 max-w-3xl">
            <Card>
                <CardHeader>
                    <CardTitle>Configuración de Proyecto</CardTitle>
                    <CardDescription>Configure los parámetros del proyecto a crear</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-4">
                            
                            {/* <div className="mb-6 text-sm">
                                Solicitado por:{" "}
                                <a href="mailto:fgavegno@geoagro.com" className="text-blue-600 hover:underline">
                                    fgavegno@geoagro.com
                                </a>
                            </div>*/}

                            <div className="space-y-2">
                                <Label htmlFor="protocol">Protocolo*</Label>
                                <Select
                                    value={formData.protocol}
                                    onValueChange={(value) => setFormData({ ...formData, protocol: value })}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Seleccionar protocolo" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="monitoreo-malezas">Monitoreo satelital y control de malezas</SelectItem>
                                        <SelectItem value="siembra-fertilizacion">Siembra y/o Fertilización Variable</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {selectedProtocol && (
                                <div className="bg-muted/50 rounded-lg p-4">
                                    <h3 className="font-semibold mb-4 text-sm">Tareas que se configurarán en el proyecto</h3>
                                    <div className="max-h-[200px] overflow-y-auto pr-2">
                                        <Accordion type="single" collapsible className="w-full">
                                            {selectedProtocol.tasks.map((task, index) => (
                                                <AccordionItem key={index} value={`item-${index}`}>
                                                    <AccordionTrigger className="text-left text-sm py-2">
                                                        <div>
                                                            {task.title}
                                                        </div>
                                                    </AccordionTrigger>
                                                    <AccordionContent className="text-sm">{task.description}</AccordionContent>
                                                </AccordionItem>
                                            ))}
                                        </Accordion>
                                    </div>
                                </div>
                            )}

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="domain">Dominio*</Label>
                                    <Select
                                        value={formData.domain}
                                        onValueChange={(value) => setFormData({ ...formData, domain: value })}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Seleccionar dominio" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="geoagro">GeoAgro</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="area">Área*</Label>
                                    <Select value={formData.area} onValueChange={(value) => setFormData({ ...formData, area: value })}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Seleccionar área" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="area1">Área 1</SelectItem>
                                            <SelectItem value="area2">Área 2</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="workspace">Espacio de trabajo*</Label>
                                    <Select
                                        value={formData.workspace}
                                        onValueChange={(value) => setFormData({ ...formData, workspace: value })}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Seleccionar espacio de trabajo" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="aarcas">AARCAS</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="campaign">Campaña*</Label>
                                    <Select
                                        value={formData.campaign}
                                        onValueChange={(value) => setFormData({ ...formData, campaign: value })}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Seleccionar campaña" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="jun22-jul23">Jun22 - Jul23</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="farm">Establecimiento*</Label>
                                    <Select
                                        value={formData.farm}
                                        onValueChange={(value) => {
                                            setFormData({ ...formData, farm: value })
                                            setSelectedLots([])
                                        }}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Seleccionar establecimiento" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="otono">Otoño</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </div>

                        {formData.farm && getFieldsByFarm(formData.farm).length > 0 && (
                            <div className="space-y-2">
                                <Label>Lotes*</Label>
                                <div className="rounded-md border">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead className="w-12">
                                                    <Checkbox
                                                        checked={selectedLots.length === getFieldsByFarm(formData.farm).length}
                                                        onCheckedChange={toggleAll}
                                                        aria-label="Seleccionar todos"
                                                    />
                                                </TableHead>
                                                <TableHead>Lote</TableHead>
                                                <TableHead>Cultivo:Híbrido/Variedad</TableHead>
                                                <TableHead className="text-right">Hectáreas</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {getFieldsByFarm(formData.farm).map((lot) => (
                                                <TableRow key={lot.id}>
                                                    <TableCell>
                                                        <Checkbox
                                                            checked={selectedLots.includes(lot.id)}
                                                            onCheckedChange={() => toggleLote(lot.id)}
                                                            aria-label={`Seleccionar lote ${lot.lote}`}
                                                        />
                                                    </TableCell>
                                                    <TableCell>{lot.lote}</TableCell>
                                                    <TableCell>{lot.cultivo}</TableCell>
                                                    <TableCell className="text-right">{lot.hectareas.toFixed(3)}</TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            </div>
                        )}

                        <div className="space-y-2">
                            <Label htmlFor="dueDate">Fecha límite*</Label>
                            <Input
                                type="date"
                                id="dueDate"
                                value={formData.dueDate}
                                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                                min={new Date().toISOString().split("T")[0]}
                                className="w-auto"
                            />
                        </div>

                        {/* <div className="space-y-2">
                            <Label>Usuarios asignados al proyecto*</Label>
                            <div className="space-y-4">
                                <div className="flex space-x-2">
                                    <Select value={newUser.email} onValueChange={(value) => setNewUser({ ...newUser, email: value })}>
                                        <SelectTrigger className="w-[200px]">
                                            <SelectValue placeholder="Seleccionar usuario" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {availableUsers.map((user) => (
                                                <SelectItem key={user.email} value={user.email}>
                                                    {user.email}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <Select value={newUser.role} onValueChange={(value) => setNewUser({ ...newUser, role: value })}>
                                        <SelectTrigger className="w-[200px]">
                                            <SelectValue placeholder="Seleccionar rol" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {availableRoles.map((role) => (
                                                <SelectItem key={role} value={role}>
                                                    {role}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <Button type="button" onClick={addAssignedUser}>
                                        Agregar
                                    </Button>
                                </div>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Email</TableHead>
                                            <TableHead>Rol</TableHead>
                                            <TableHead className="w-[100px]">Acciones</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {assignedUsers.map((user, index) => (
                                            <TableRow key={index}>
                                                <TableCell>{user.email}</TableCell>
                                                <TableCell>{user.role}</TableCell>
                                                <TableCell>
                                                    <Button variant="ghost" size="sm" onClick={() => removeAssignedUser(index)}>
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </div> */}

                        <div className="space-y-2">
                            <Label htmlFor="participantsEmails">Emails para notificaciones*</Label>
                            <div className="flex flex-wrap gap-2 mb-2">
                                {participants.map((email) => (
                                    <Badge key={email} variant="secondary" className="bg-primary text-primary-foreground">
                                        {email}
                                        <button
                                            type="button"
                                            onClick={() => removeEmail(email)}
                                            className="ml-2 hover:text-red-400 focus:outline-none"
                                        >
                                            <X className="h-3 w-3" />
                                        </button>
                                    </Badge>
                                ))}
                            </div>
                            <Input
                                type="email"
                                id="participantsEmails"
                                value={emailInput}
                                onChange={(e) => setEmailInput(e.target.value)}
                                onKeyDown={handleEmailKeyDown}
                                placeholder="Presione ENTER para añadir"
                                className="mt-1"
                            />
                        </div>

                        <Button type="submit" className="w-full">
                            Iniciar
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
