"use client"

import { useTranslations } from 'next-intl';
import { Link as BreadcrumbLink2} from '@/i18n/routing';

import { useState } from "react"
import { useToast } from "@/hooks/use-toast"
//import { useToast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

import { Calendar, Link, MoreHorizontal, Search, Share2, Users } from 'lucide-react'

interface KoboForm {
    id: string
    name: string
    description: string
    created: string
    lastSubmission: string | null
    submissions: number
    isAssociated: boolean
    sharedWith: string[]
}

// Mock data - replace with actual API call
const mockForms: KoboForm[] = [
    {
        id: "aX2m4k",
        name: "Field Survey 2024",
        description: "Annual field condition assessment form",
        created: "2024-01-15",
        lastSubmission: "2024-01-23",
        submissions: 45,
        isAssociated: false,
        sharedWith: ["john@example.com", "maria@example.com"]
    },
    {
        id: "bY7n9p",
        name: "Equipment Inspection",
        description: "Daily equipment status check form",
        created: "2024-01-10",
        lastSubmission: null,
        submissions: 0,
        isAssociated: false,
        sharedWith: []
    },
    {
        id: "cZ3k8m",
        name: "Crop Monitoring",
        description: "Weekly crop growth monitoring form",
        created: "2024-01-05",
        lastSubmission: "2024-01-22",
        submissions: 28,
        isAssociated: true,
        sharedWith: ["alex@example.com"]
    }
]

export function KoboForms() {
    const [forms, setForms] = useState<KoboForm[]>(mockForms)
    const [searchQuery, setSearchQuery] = useState("")
    const [selectedForm, setSelectedForm] = useState<KoboForm | null>(null)
    const [shareEmail, setShareEmail] = useState("")
    const { toast } = useToast()

    const filteredForms = forms.filter(form =>
        form.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        form.description.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const handleAssociateForm = async (formId: string) => {
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000))

            setForms(currentForms =>
                currentForms.map(form =>
                    form.id === formId ? { ...form, isAssociated: !form.isAssociated } : form
                )
            )

            toast({
                title: "Success",
                description: "Form association updated successfully",
            })
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to update form association",
                variant: "destructive",
            })
        }
    }

    const handleShareForm = async (formId: string, email: string) => {
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000))

            setForms(currentForms =>
                currentForms.map(form =>
                    form.id === formId
                        ? { ...form, sharedWith: [...form.sharedWith, email] }
                        : form
                )
            )

            setShareEmail("")
            toast({
                title: "Success",
                description: `Form shared with ${email}`,
            })
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to share form",
                variant: "destructive",
            })
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
                        <BreadcrumbLink2 href="/projects">Projects</BreadcrumbLink2>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbLink2 href="/projects/1/tasks">Ambientación con Mapa de Productividad (DEMO)</BreadcrumbLink2>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage>Collect Forms</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl">Collect Forms</CardTitle>
                    <CardDescription>
                        Manage and share your KoboToolbox forms
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center gap-4 mb-6">
                        <div className="relative flex-1">
                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search forms..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-8"
                            />
                        </div>
                        <Button>Refresh Forms</Button>
                    </div>

                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-12">Associated</TableHead>
                                <TableHead>Form Details</TableHead>
                                <TableHead>Submissions</TableHead>
                                <TableHead>Shared With</TableHead>
                                <TableHead className="w-12"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredForms.map((form) => (
                                <TableRow key={form.id}>
                                    <TableCell>
                                        <Checkbox
                                            checked={form.isAssociated}
                                            onCheckedChange={() => handleAssociateForm(form.id)}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <div className="space-y-1">
                                            <div className="font-medium">{form.name}</div>
                                            <div className="text-sm text-muted-foreground">
                                                {form.description}
                                            </div>
                                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                                <span className="flex items-center gap-1">
                                                    <Calendar className="h-3 w-3" />
                                                    Created: {form.created}
                                                </span>
                                                {form.lastSubmission && (
                                                    <span className="flex items-center gap-1">
                                                        <Link className="h-3 w-3" />
                                                        Last submission: {form.lastSubmission}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={form.submissions > 0 ? "default" : "secondary"}>
                                            {form.submissions} submissions
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        {form.sharedWith.length > 0 ? (
                                            <div className="flex items-center gap-2">
                                                <Users className="h-4 w-4 text-muted-foreground" />
                                                <span>{form.sharedWith.length} users</span>
                                            </div>
                                        ) : (
                                            <span className="text-muted-foreground">Not shared</span>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                    <span className="sr-only">Open menu</span>
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                <DropdownMenuItem
                                                    onClick={() => setSelectedForm(form)}
                                                    className="flex items-center gap-2"
                                                >
                                                    <Share2 className="h-4 w-4" />
                                                    Share Form
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem>View Details</DropdownMenuItem>
                                                <DropdownMenuItem>View Submissions</DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>

                    <Dialog open={!!selectedForm} onOpenChange={() => setSelectedForm(null)}>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Share Form</DialogTitle>
                                <DialogDescription>
                                    Share "{selectedForm?.name}" with other users
                                </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email address</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="Enter email address"
                                        value={shareEmail}
                                        onChange={(e) => setShareEmail(e.target.value)}
                                    />
                                </div>
                                {selectedForm?.sharedWith.length ? (
                                    <div className="space-y-2">
                                        <Label>Currently shared with</Label>
                                        <div className="space-y-1">
                                            {selectedForm.sharedWith.map((email) => (
                                                <Badge key={email} variant="secondary" className="mr-1">
                                                    {email}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>
                                ) : null}
                            </div>
                            <DialogFooter>
                                <Button
                                    onClick={() => {
                                        if (selectedForm) {
                                            handleShareForm(selectedForm.id, shareEmail)
                                            setSelectedForm(null)
                                        }
                                    }}
                                    disabled={!shareEmail}
                                >
                                    Share Form
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </CardContent>
            </Card>
        </div>
    )
}
