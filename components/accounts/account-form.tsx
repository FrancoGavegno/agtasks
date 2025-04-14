"use client"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { domains, taskManagerTypes } from "@/lib/data"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import type { Account } from "@/types/account"
import { FormField, FormItem, FormLabel, FormControl, FormMessage, Form } from "@/components/ui/form"
import { Link } from "@/i18n/routing"

interface AccountFormProps {
  account?: Account
  locale: string
  isEditing?: boolean
}

interface FormValues {
  domain: string
  taskManagerType: string
  taskManagerApiKey: string
  koboToolboxApiKey: string
}

export function AccountForm({ account, locale, isEditing = false }: AccountFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Masked values for API keys in edit mode
  const maskedValue = "***********"

  // Initialize form with React Hook Form
  const form = useForm<FormValues>({
    defaultValues: {
      domain: account?.domain || "",
      taskManagerType: account?.taskManagerType || "Jira",
      taskManagerApiKey: account?.taskManagerApiKey || "",
      koboToolboxApiKey: account?.koboToolboxApiKey || "",
    },
  })

  const onSubmit = (data: FormValues) => {
    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false)
      if (isEditing && account) {
        router.push(`/${locale}/accounts/${account.id}`)
      } else {
        router.push(`/${locale}/accounts`)
      }
    }, 1000)
  }

  return (
    <div className="space-y-6">
      <div>
        <Link href="/accounts"
          className="group flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
          Back to Accounts
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{isEditing ? "Edit Account" : "Create New Account"}</CardTitle>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="domain"
                rules={{ required: "Domain is required" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Domain <span className="text-red-500">*</span>
                    </FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {domains.map((domain) => (
                          <SelectItem key={domain} value={domain}>
                            {domain}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="taskManagerType"
                rules={{ required: "Task Manager Type is required" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Task Manager Type <span className="text-red-500">*</span>
                    </FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {taskManagerTypes.map((type) => (
                          <SelectItem key={type} value={type} disabled={type !== "Jira"}>
                            {type}
                            {type !== "Jira" && " (Coming soon)"}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground">Currently, only Jira integration is available.</p>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="taskManagerApiKey"
                rules={{ required: "Task Manager API Key is required" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Task Manager API Key <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder=""
                        value={isEditing ? maskedValue : field.value}
                        type={isEditing ? "text" : "password"}
                        className="font-mono"
                      />
                    </FormControl>
                    {isEditing && (
                      <p className="text-xs text-muted-foreground">
                        For security reasons, API keys are masked. Enter a new value to change it.
                      </p>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="koboToolboxApiKey"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Kobo Toolbox API Key</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder=""
                        value={isEditing ? maskedValue : field.value}
                        type={isEditing ? "text" : "password"}
                        className="font-mono"
                      />
                    </FormControl>
                    {isEditing && (
                      <p className="text-xs text-muted-foreground">
                        For security reasons, API keys are masked. Enter a new value to change it.
                      </p>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex gap-2 pt-4">
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Saving..." : "Confirm"}
                </Button>
                <Link href="/accounts">
                  <Button variant="outline" type="button">
                    Cancel
                  </Button>
                </Link>
              </div>

            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}

