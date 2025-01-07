"use client"

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Loader2, Search } from 'lucide-react'

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
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
//import { useToast } from "@/components/ui/use-toast"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"

import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

// Mock data - replace with actual API response
interface ClickupList {
    id: string
    name: string
    content: string
    due_date: string | null
    orderindex: number
    status: {
        status: string
        color: string
    }
    priority: {
        priority: string
        color: string
    }
    assignee: {
        id: number
        username: string
        email: string
        color: string
        profilePicture: string
    } | null
    task_count: number
    folder: {
        id: string
        name: string
    }
    space: {
        id: string
        name: string
    }
}

const mockLists: ClickupList[] = [
    {
        id: "123456",
        name: "Sprint Planning Template",
        content: "Template for sprint planning meetings and tasks",
        due_date: null,
        orderindex: 1,
        status: {
            status: "active",
            color: "#4CAF50"
        },
        priority: {
            priority: "normal",
            color: "#FFA000"
        },
        assignee: null,
        task_count: 15,
        folder: {
            id: "f1",
            name: "Development"
        },
        space: {
            id: "s1",
            name: "Engineering"
        }
    },
    {
        id: "789012",
        name: "Content Calendar",
        content: "Monthly content planning and tracking",
        due_date: null,
        orderindex: 2,
        status: {
            status: "active",
            color: "#2196F3"
        },
        priority: {
            priority: "high",
            color: "#F44336"
        },
        assignee: null,
        task_count: 8,
        folder: {
            id: "f2",
            name: "Marketing"
        },
        space: {
            id: "s2",
            name: "Marketing"
        }
    }
]

const formSchema = z.object({
    listId: z.string({
        required_error: "Please select a list to import",
    }),
    name: z.string().min(2, {
        message: "Template name must be at least 2 characters.",
    }),
    description: z.string().optional(),
})

export function ImportTemplateForm() {
    const [lists, setLists] = useState<ClickupList[]>(mockLists)
    const [isLoading, setIsLoading] = useState(false)
    const [selectedList, setSelectedList] = useState<ClickupList | null>(null)
    const [open, setOpen] = useState(false)
    const { toast } = useToast()

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            setIsLoading(true)
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 2000))
            console.log(values)

            toast({
                title: "Template imported",
                description: "The list has been imported as a template successfully.",
            })

            form.reset()
            setSelectedList(null)
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to import template. Please try again.",
                variant: "destructive",
            })
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="container px-5 py-10 mx-auto">
            <Breadcrumb className="mb-8">
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink href="/">Home</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <Link href="/templates">Templates</Link>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage>Import Template From Clickup</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            <Card>
                <CardHeader>
                    <CardTitle>Import List as Template</CardTitle>
                    <CardDescription>
                        Select a Clickup List to import as a template
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                            <FormField
                                control={form.control}
                                name="listId"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col">
                                        <FormLabel>Select List</FormLabel>
                                        <Popover open={open} onOpenChange={setOpen}>
                                            <PopoverTrigger asChild>
                                                <FormControl>
                                                    <Button
                                                        variant="outline"
                                                        role="combobox"
                                                        className={cn(
                                                            "w-full justify-between",
                                                            !field.value && "text-muted-foreground"
                                                        )}
                                                    >
                                                        {selectedList ? selectedList.name : "Select a list"}
                                                        <Search className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                    </Button>
                                                </FormControl>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-[400px] p-0">
                                                <Command>
                                                    <CommandInput placeholder="Search lists..." />
                                                    <CommandEmpty>No lists found.</CommandEmpty>
                                                    <CommandGroup>
                                                        {lists.map((list) => (
                                                            <CommandItem
                                                                key={list.id}
                                                                value={list.id}
                                                                onSelect={() => {
                                                                    form.setValue("listId", list.id)
                                                                    form.setValue("name", list.name)
                                                                    form.setValue("description", list.content || "")
                                                                    setSelectedList(list)
                                                                    setOpen(false)
                                                                }}
                                                            >
                                                                <div className="flex flex-col">
                                                                    <span>{list.name}</span>
                                                                    <span className="text-sm text-muted-foreground">
                                                                        {list.space.name} / {list.folder.name}
                                                                    </span>
                                                                </div>
                                                            </CommandItem>
                                                        ))}
                                                    </CommandGroup>
                                                </Command>
                                            </PopoverContent>
                                        </Popover>
                                        <FormDescription>
                                            Select a list from your Clickup workspace to import as a template
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {selectedList && (
                                <>
                                    <FormField
                                        control={form.control}
                                        name="name"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Template Name</FormLabel>
                                                <FormControl>
                                                    <Input {...field} />
                                                </FormControl>
                                                <FormDescription>
                                                    This will be the name of your new template
                                                </FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="description"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Description</FormLabel>
                                                <FormControl>
                                                    <Textarea {...field} />
                                                </FormControl>
                                                <FormDescription>
                                                    Provide a description for your template
                                                </FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <Card className="bg-muted">
                                        <CardHeader>
                                            <CardTitle className="text-sm">List Details</CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-2">
                                            <div className="grid grid-cols-2 gap-4 text-sm">
                                                <div>
                                                    <span className="font-medium">Space:</span>{" "}
                                                    {selectedList.space.name}
                                                </div>
                                                <div>
                                                    <span className="font-medium">Folder:</span>{" "}
                                                    {selectedList.folder.name}
                                                </div>
                                                <div>
                                                    <span className="font-medium">Status:</span>{" "}
                                                    <span
                                                        className="inline-block w-3 h-3 rounded-full mr-1"
                                                        style={{ backgroundColor: selectedList.status.color }}
                                                    />
                                                    {selectedList.status.status}
                                                </div>
                                                <div>
                                                    <span className="font-medium">Tasks:</span>{" "}
                                                    {selectedList.task_count}
                                                </div>
                                                <div>
                                                    <span className="font-medium">Priority:</span>{" "}
                                                    <span
                                                        className="inline-block w-3 h-3 rounded-full mr-1"
                                                        style={{ backgroundColor: selectedList.priority.color }}
                                                    />
                                                    {selectedList.priority.priority}
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </>
                            )}

                            <div className="flex justify-end">
                                <Button type="submit" disabled={isLoading}>
                                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    {isLoading ? "Importing..." : "Import as Template"}
                                </Button>
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    )
}

