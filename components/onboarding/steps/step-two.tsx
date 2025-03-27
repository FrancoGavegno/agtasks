"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { koboFormSchema, type KoboFormValues } from "@/lib/validations/onboarding"
import { useOnboarding } from "../onboarding-context"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { KeyIcon, ArrowRightIcon, ArrowLeftIcon } from "lucide-react"

export function StepTwo() {
  const { setKoboData, nextStep, prevStep, skipStep, data } = useOnboarding()
  const [isValidating, setIsValidating] = useState(false)

  const form = useForm<KoboFormValues>({
    resolver: zodResolver(koboFormSchema),
    defaultValues: data.kobo || {
      apiKey: "",
    },
  })

  const onSubmit = async (values: KoboFormValues) => {
    setIsValidating(true)

    try {
      // Simulación de validación de API Key
      await new Promise((resolve) => setTimeout(resolve, 1000))

      setKoboData(values)
      nextStep()
    } catch (error) {
      console.error("Error validando API Key de Kobo Toolbox:", error)
    } finally {
      setIsValidating(false)
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl">Paso 2 de 3: Conecta Kobo Toolbox</CardTitle>
        <CardDescription>Conecta tu cuenta de Kobo Toolbox para utilizar tus propios formularios. Dejalo en blanco para usar formularios del repositorio de GeoAgro.</CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="apiKey"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>API Key de Kobo Toolbox</FormLabel>
                  <FormControl>
                    <div className="flex items-center space-x-2">
                      <KeyIcon className="w-5 h-5 text-muted-foreground" />
                      <Input placeholder="Ingresa tu API Key de Kobo Toolbox" {...field} className="flex-1" />
                    </div>
                  </FormControl>
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
              <Button type="button" variant="ghost" onClick={skipStep}>
                Omitir
              </Button>
              <Button type="submit" disabled={isValidating}>
                {isValidating ? "Validando..." : "Continuar"}
                {!isValidating && <ArrowRightIcon className="ml-2 h-4 w-4" />}
              </Button>
            </div>
          </CardFooter>
        </form>
      </Form>
    </Card>
  )
}

