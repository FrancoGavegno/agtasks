"use client"

import { useEffect, useState } from "react"
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { Amplify } from "aws-amplify";
import outputs from "@/amplify_outputs.json";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
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
  LayoutTemplate,
  MoreVertical,
  Pencil,
  Trash
} from 'lucide-react'


Amplify.configure(outputs);
const client = generateClient<Schema>();


export function TemplatesList() {
  const t = useTranslations('TemplatesPage');
  const [templates, setTemplates] = useState<Array<Schema["Template"]["type"]>>([]);
  const [searchQuery, setSearchQuery] = useState("")
  const [visibilityFilter, setVisibilityFilter] = useState<string>("all")

  function listTemplates() {
    client.models.Template.observeQuery().subscribe({
      next: (data) => setTemplates([...data.items]),
    });
  }

  const handleEdit = (templateId: string) => {
    // Implementar lógica de edición
    console.log('Edit template:', templateId)
  }

  const handleDelete = async (templateId: string) => {
    await client.models.Template.delete({ id: templateId });
    console.log('Template deleted: ', templateId)
  }

  useEffect(() => {
    listTemplates();
  }, []);


  const filteredTemplates = templates.filter(template => {
    const matchesSearch =
      template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.tags?.some(tag => tag?.toLowerCase().includes(searchQuery.toLowerCase())) ||
      template.scope?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesVisibility = visibilityFilter === "all" || template.visibility === visibilityFilter.toLocaleUpperCase();
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
          {/* <Button className='gap-2' onClick={deleteAllTemplates}>
            Eliminar
          </Button> */}
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
              <CardHeader className="flex flex-row items-start justify-between space-y-0">
                <div className="min-h-18">
                  <CardTitle className="min-h-8">
                    {template.name}
                  </CardTitle>
                  <CardDescription className="min-h-10 pt-1">
                    {template.description}
                  </CardDescription>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Open menu</span>
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() => handleEdit(template.id)}
                    >
                      <Pencil className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => handleDelete(template.id)}
                      className="text-red-600"
                    >
                      <Trash className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </CardHeader>
              <CardContent className="flex-1">
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center">
                    <Users className="mr-1 h-4 w-4" />
                    {template.visibility}
                    {/* <FileText className="mr-1 h-4 w-4" />
                    {template.taskCount} tasks */}
                  </div>
                  <div className="flex items-center">
                    <LayoutTemplate className="mr-1 h-4 w-4" />
                    {template.scope}
                  </div>

                  <div className="flex items-center">

                  </div>
                </div>
                <Separator className="my-4" />
                <div className="flex flex-wrap gap-2">
                  {template.tags?.map((tag) => (
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
                  <Link target="_blank" href={template.templateUrl}>
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
