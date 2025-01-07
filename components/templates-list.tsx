"use client"

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { useEffect, useState } from "react"
import { getLists } from '@/lib/clickup';
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import {
    FileText,
    Search,
    Users,
    Tags,
    LayoutTemplate
} from 'lucide-react'

// Ref.: https://developer.clickup.com/reference/getlists
// {
//     "lists": [
//       {
//         "id": "901106185206",
//         "name": "Ambientación con Mapa de Productividad",
//         "orderindex": 1,
//         "content": "",
//         "status": null,
//         "priority": null,
//         "assignee": null,
//         "task_count": 4,
//         "due_date": "1733554800000",
//         "start_date": null,
//         "folder": {
//           "id": "90113518509",
//           "name": "Siembra Variable",
//           "hidden": false,
//           "access": true
//         },
//         "space": {
//           "id": "90111991192",
//           "name": "Ambientación",
//           "access": true
//         },
//         "archived": false,
//         "override_statuses": false,
//         "permission_level": "create"
//       },
//       { ... },
//     ]
//   }

interface Template {
    id: string;
    name: string;
    description: string;
    taskCount: number;
    space: string;
    tags: string[];
    visibility: "community" | "private";
    thumbnail?: string;
}

export function TemplatesList() {
    const t = useTranslations('TemplatesPage');
    // parentId = Folder ID From GeoAgro Clickup Official Account
    const parentId = process.env.NEXT_PUBLIC_TEMPLATES || "123";
    const [templates, setTemplates] = useState<Template[]>([]);
    const [searchQuery, setSearchQuery] = useState("")
    const [visibilityFilter, setVisibilityFilter] = useState<string>("all")

    useEffect(() => {
        getLists(parentId)
            .then((data) => {
                const lists = data.lists || data;
                if (Array.isArray(lists)) {
                    const fetchedTemplates: Template[] = lists.map((list: any) => ({
                        id: list.id,
                        name: list.name,
                        description: list.content || '',
                        taskCount: list.task_count,
                        space: list.space?.name || 'Unknown Space',
                        tags: ['Project', 'Agriculture', 'GeoAgro'],
                        visibility: 'community',
                        thumbnail: undefined
                    }));
                    setTemplates(fetchedTemplates);
                } else {
                    console.error('Unexpected data format:', lists);
                }
            })
            .catch((error) => {
                console.error('Error fetching lists:', error);
            });
    }, []);

    const filteredTemplates = templates.filter(template => {
        const matchesSearch =
            template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
            template.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));

        const matchesVisibility = visibilityFilter === "all" || template.visibility === visibilityFilter;
        return matchesSearch && matchesVisibility;
    });

    return (
        <div className="container px-1 py-10 mx-auto">

            <div className="flex items-center justify-between mb-8">
                <div>
                    <h2 className="text-2xl font-bold">{t('title')}</h2>
                    <p className="text-muted-foreground">{t('subtitle')}</p>
                </div>
                <div className='flex items-center space-x-2'>
                    <Button className="gap-2">
                        <Link href="/templates/register">
                            <span>
                                {t('newTemplate')}
                            </span>
                        </Link>
                    </Button>
                </div>
            </div>

            <div className="flex flex-col gap-6">
                <div className="flex items-center gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search templates..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-8"
                        />
                    </div>
                    <Select
                        value={visibilityFilter}
                        onValueChange={setVisibilityFilter}
                    >
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select visibility" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Templates</SelectItem>
                            <SelectItem value="community">Community</SelectItem>
                            <SelectItem value="private">Private</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">

                    {templates.length > 0 && filteredTemplates.map((template) => (
                        <Card key={template.id} className="flex flex-col">
                            <CardHeader>
                                <CardTitle>{template.name}</CardTitle>
                                <CardDescription>{template.description}</CardDescription>
                            </CardHeader>
                            <CardContent className="flex-1">
                                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                    <div className="flex items-center">
                                        <FileText className="mr-1 h-4 w-4" />
                                        {template.taskCount} tasks
                                    </div>
                                    <div className="flex items-center">
                                        <LayoutTemplate className="mr-1 h-4 w-4" />
                                        {template.space}
                                    </div>
                                    {template.visibility === "community" && (
                                        <div className="flex items-center">
                                            <Users className="mr-1 h-4 w-4" />
                                            Community
                                        </div>
                                    )}
                                </div>
                                <Separator className="my-4" />
                                <div className="flex flex-wrap gap-2">
                                    {template.tags.map((tag) => (
                                        <Badge key={tag} variant="secondary">
                                            <Tags className="h-3 w-3" />
                                            <span className="pl-1">{tag}</span>
                                        </Badge>
                                    ))}
                                </div>
                            </CardContent>

                            <CardFooter className="border-t pt-4">
                                <Button asChild
                                    className='w-full'
                                >
                                    <Link target="_blank" href="https://app.clickup.com/template/subcategory/t-901108172141/e2dc3a4ed6f03c4ef7">
                                        {t('useTemplate')}
                                    </Link>
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}

                    {templates.length > 0 && filteredTemplates.length === 0 && (
                        <Card className="col-span-full">
                            <CardContent className="flex flex-col items-center justify-center py-8 text-center">
                                <LayoutTemplate className="h-8 w-8 text-muted-foreground mb-4" />
                                <h3 className="text-lg font-semibold">{t('noTemplatesTitle')}</h3>
                                <p className="text-sm text-muted-foreground">
                                    {t('noTemplatesSubtitle')}
                                </p>
                            </CardContent>
                        </Card>
                    )}

                    {/* <div className="col-span-full text-center py-10">
                            <div className="text-muted-foreground">
                                No templates found matching your criteria
                            </div>
                        </div> */}
                </div>
            </div>
        </div>
    )
}

