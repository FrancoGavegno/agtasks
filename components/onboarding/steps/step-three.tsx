"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { portalFormSchema, type PortalFormValues } from "@/lib/validations/onboarding"
import { useOnboarding } from "../onboarding-context"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeftIcon, CheckIcon } from "lucide-react"

export function StepThree() {
  const { setPortalData, prevStep, skipStep, data } = useOnboarding()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<PortalFormValues>({
    resolver: zodResolver(portalFormSchema),
    defaultValues: data.portal || {
      name: "",
      domain: "",
      area: "",
      workspace: "",
      jiraProject: "",
    },
  })

  const onSubmit = async (values: PortalFormValues) => {
    setIsSubmitting(true)

    try {
      // Simulación de creación del portal
      await new Promise((resolve) => setTimeout(resolve, 1500))

      setPortalData(values)
      // Aquí se podría redirigir al usuario a la página principal
      window.location.href = "/en/portals"
    } catch (error) {
      console.error("Error creando el portal de servicio:", error)
      setIsSubmitting(false)
    }
  }

  const handleSkip = () => {
    skipStep()
    // Aquí se podría redirigir al usuario a la página principal
    window.location.href = "/en/portals"
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl">Paso 3 de 3: Crea un Portal de Servicio</CardTitle>
        <CardDescription>Este Portal te permite recibir Pedidos de Servicios y Tareas de tus stakeholders.</CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex">
                    Nombre <span className="text-destructive ml-1">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="domain"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex">
                    Domain <span className="text-destructive ml-1">*</span>
                  </FormLabel>
                  <Select onValueChange={field.onChange} value={field.value || ""}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="geoagro">GeoAgro</SelectItem>
                      <SelectItem value="rigran">Rigran</SelectItem>
                      <SelectItem value="cerestolvas">Cerestolvas</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

          <FormField
              control={form.control}
              name="area"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex">
                    Área <span className="text-destructive ml-1">*</span>
                  </FormLabel>
                  <Select onValueChange={field.onChange} value={field.value || ""}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="area1">Área 1</SelectItem>
                      <SelectItem value="area2">Área 2</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="workspace"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Espacio de trabajo</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value || ""}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="none">---</SelectItem>
                      <SelectItem value="espacio1">Espacio 1</SelectItem>
                      <SelectItem value="espacio2">Espacio 2</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="jiraProject"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex">
                    Proyecto <span className="text-destructive ml-1">*</span>
                  </FormLabel>
                  <Select onValueChange={field.onChange} value={field.value || ""}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="project1">Project 1</SelectItem>
                      <SelectItem value="project2">Project 2</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>

          <CardFooter className="flex justify-between">
            <Button type="button" variant="outline" onClick={prevStep}>
              <ArrowLeftIcon className="mr-2 h-4 w-4" />
              Atrás
            </Button>
            <div className="flex space-x-2">
              <Button type="button" variant="ghost" onClick={handleSkip}>
                Omitir
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Creando..." : "Crear portal"}
                {!isSubmitting && <CheckIcon className="ml-2 h-4 w-4" />}
              </Button>
            </div>
          </CardFooter>
        </form>
      </Form>
    </Card>
  )
}

