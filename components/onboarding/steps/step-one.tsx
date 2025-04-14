"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { jiraFormSchema, type JiraFormValues } from "@/lib/validations/onboarding"
import { useOnboarding } from "../onboarding-context"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { KeyIcon, ArrowRightIcon } from "lucide-react"

export function StepOne() {
  const { setJiraData, nextStep, data } = useOnboarding()
  const [isValidating, setIsValidating] = useState(false)

  const form = useForm<JiraFormValues & { taskManager: string }>({
    resolver: zodResolver(
      jiraFormSchema.extend({
        taskManager: z.string().default("jira"),
      }),
    ),
    defaultValues: {
      ...(data.jira || { apiKey: "" }),
      taskManager: "jira",
    },
  })

  const onSubmit = async (values: JiraFormValues & { taskManager: string }) => {
    setIsValidating(true)

    // Simulación de validación de API Key
    try {
      // En un caso real, aquí se haría una llamada a la API para validar la clave
      await new Promise((resolve) => setTimeout(resolve, 1000))

      setJiraData({ apiKey: values.apiKey })
      nextStep()
    } catch (error) {
      console.error("Error validando API Key:", error)
    } finally {
      setIsValidating(false)
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl">Paso 1 de 3: Conecta tu gestor de tareas</CardTitle>
        <CardDescription>Conecta tu cuenta de Task manager para utilizar tus propios proyectos.</CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="taskManager"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Task Manager</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona un gestor de tareas" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="jira">Jira</SelectItem>
                      <SelectItem value="clickup" disabled>
                        Clickup (Próximamente)
                      </SelectItem>
                      <SelectItem value="trello" disabled>
                        Trello (Próximamente)
                      </SelectItem>
                      <SelectItem value="asana" disabled>
                        Asana (Próximamente)
                      </SelectItem>
                      <SelectItem value="monday" disabled>
                        Monday.com (Próximamente)
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="apiKey"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>API Key</FormLabel>
                  <FormControl>
                    <div className="flex items-center space-x-2">
                      <KeyIcon className="w-5 h-5 text-muted-foreground" />
                      <Input placeholder="Ingresa tu API Key" {...field} className="flex-1" />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button type="submit" disabled={isValidating}>
              {isValidating ? "Validando..." : "Continuar"}
              {!isValidating && <ArrowRightIcon className="ml-2 h-4 w-4" />}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  )
}

