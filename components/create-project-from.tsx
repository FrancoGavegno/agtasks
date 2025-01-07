'use client'

import * as React from "react"
import { useSearchParams } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
// import { useToast } from "@/hooks/use-toast"
import { Loader2 } from 'lucide-react'
import { FormValues } from "@/lib/types"

const formSchema = z.object({
    template: z.string(),
    name: z.string()
        .min(2, "Name must be at least 2 characters")
        .max(50, "Name must be less than 50 characters"),
    folder: z.enum(["DS_Bossio", "DS_Local", "DS_local_KMZ", "DS_local_shp", "DS_MyJD_360Dev"], {
        required_error: "Please select a folder",
    })
})

const folders = [
    { id: "DS_Bossio", name: "DS_Bossio" },
    { id: "DS_Local", name: "DS_Local" },
    { id: "DS_local_KMZ", name: "DS_local_KMZ" },
    { id: "DS_local_shp", name: "DS_local_shp" },
    { id: "DS_MyJD_360Dev", name: "DS_MyJD_360Dev" },
]


export default function CreateProjectFrom() {
    const [isSubmitting, setIsSubmitting] = React.useState(false)

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            template: "Ambientación con Mapa de Productividad",
            name: "",
            folder: "DS_Bossio",
        },
    })

    async function onSubmit(values: FormValues) {
        // Simulate a request
    }

    return (
        <div className="max-w-2xl mx-auto p-6">
            <div className="mb-6">
                <h2 className="text-2xl font-bold tracking-tight">Create New Project</h2>
                <p className="text-muted-foreground">
                    Create a new project from the selected ClickUp template.
                </p>
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                        control={form.control}
                        name="template"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Selected Template</FormLabel>
                                <FormControl>
                                    <Input {...field} readOnly />
                                </FormControl>
                                <FormDescription>
                                    This is the template selected for your project
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="Enter project name" {...field} />
                                </FormControl>
                                <FormDescription>
                                    This will be the display name of your Project
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="folder"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Folder</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a folder" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {folders.map((folder) => (
                                            <SelectItem key={folder.id} value={folder.id}>
                                                {folder.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormDescription>
                                    Select the folder where the Project will be created
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Create Project
                    </Button>
                </form>
            </Form>
        </div>
    )
}

