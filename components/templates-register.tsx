'use client'

import * as React from "react"
import { useTranslations } from 'next-intl';
// import { Link } from '@/i18n/routing';
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Amplify } from "aws-amplify";
import outputs from "@/amplify_outputs.json";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Loader2, X } from 'lucide-react';
import { FormValues } from "@/lib/types";


Amplify.configure(outputs);
const client = generateClient<Schema>();


const formSchema = z.object({
  templateUrl: z.string().url("Please enter a valid URL"),
  name: z.string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be less than 100 characters"),
  description: z.string(),
  visibility: z.enum(
    [
      "COMMUNITY",
      "PRIVATE"
    ],
    {
      required_error: "Please select template visibility",
    }
  ).default("COMMUNITY"),
  tags: z.array(z.string()).min(1, "Please add at least one tag"),
  scope: z.enum(
    [
      "NONE",
      "INHERITED",
      "DOMAIN",
      "AREA",
      "WORKSPACE",
      "FARM",
      "FIELD"
    ],
    {
      required_error: "Please select template scope",
    }
  ).default("INHERITED"),
})


export default function RegisterTemplateForm() {
  const t = useTranslations('RegisterTemplateForm');
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [tags, setTags] = React.useState<string[]>([])


  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      templateUrl: "",
      name: "",
      description: "",
      visibility: "COMMUNITY",
      tags: [],
      scope: "INHERITED"
    },
  })


  const addTag = (tag: string) => {
    if (tag && !tags.includes(tag)) {
      setTags([...tags, tag])
      form.setValue('tags', [...tags, tag])
    }
  }


  const removeTag = (tagToRemove: string) => {
    const updatedTags = tags.filter(tag => tag !== tagToRemove)
    setTags(updatedTags)
    form.setValue('tags', updatedTags)
  }


  async function onSubmit(values: FormValues) {
    setIsSubmitting(true)
    try {
      // Crea el template usando los valores del formulario 
      const createTemplate = client.models.Template.create({
        templateUrl: values.templateUrl,
        name: values.name,
        description: values.description,
        taskCount: values.taskCount,
        tags: values.tags,
        visibility: values.visibility,
        scope: values.scope,
      });
      await createTemplate;

      toast({
        title: "Success",
        description: `Template created successfully`,
      });

      form.reset();
      setTags([]);
    } catch (error) {
      toast({
        title: "Error",
        description: (error as Error).message || "Something went wrong",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }


  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold tracking-tight">New Template</h2>
        <p className="text-muted-foreground">
          Register a new template in our repository templates.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="templateUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Template URL</FormLabel>
                <FormControl>
                  <Input placeholder="https://app.clickup.com/t/..." {...field} />
                </FormControl>
                <FormDescription>
                  Enter the URL of the template you want to use
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
                  <Input placeholder="" {...field} />
                </FormControl>
                <FormDescription>
                  This will be the display name of your template
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
                  <Textarea
                    placeholder=""
                    {...field}
                  />
                </FormControl>
                {/* <FormDescription>
                  Provide a brief description of the template
                </FormDescription> */}
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="visibility"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Visibility</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="COMMUNITY">Community</SelectItem>
                    <SelectItem value="PRIVATE">Private</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>
                  Choose whether the template should be visible to the community or private
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="tags"
            render={() => (
              <FormItem>
                <FormLabel>Tags</FormLabel>
                <FormControl>
                  <div className="flex flex-wrap gap-2">
                    {tags.map(tag => (
                      <Badge key={tag} variant="secondary" className="text-sm">
                        {tag}
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="ml-2 h-auto p-0 text-muted-foreground hover:text-foreground"
                          onClick={() => removeTag(tag)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </Badge>
                    ))}
                    <Input
                      placeholder=""
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault()
                          addTag((e.target as HTMLInputElement).value)
                            ; (e.target as HTMLInputElement).value = ''
                        }
                      }}
                    />
                  </div>
                </FormControl>
                <FormDescription>
                  Press Enter to add a tag
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="scope"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Scope</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="NONE">None</SelectItem>
                    <SelectItem value="INHERITED">Inherited</SelectItem>
                    <SelectItem value="DOMAIN">Domain</SelectItem>
                    <SelectItem value="AREA">Area</SelectItem>
                    <SelectItem value="WORKSPACE">Workspace</SelectItem>
                    <SelectItem value="FARM">Farm</SelectItem>
                    <SelectItem value="FIELD">Field</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>
                  Choose whether the template should be visible
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Create Template
          </Button>
        </form>
      </Form>
    </div>
  )
}

