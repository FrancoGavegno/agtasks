"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { useTranslations } from 'next-intl';
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import { client } from "@/lib/amplify"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ConnectedAccount } from "@/components/account/connected-account"

interface FormData {
  apiKey: string
  teamId: string
}

export function Account() {
  const t = useTranslations('AccountsPage');
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle")
  const queryClient = useQueryClient()

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>()

  const { data: existingConfig, isLoading: isLoadingConfig } = useQuery({
    queryKey: ["tmConfig"],
    queryFn: async () => {
      try {
        const result = await client.models.TaskManagerConfig.list()
        return result
      } catch (error) {
        console.error("Error fetching configuration:", error)
        throw new Error("Failed to fetch configuration")
      }
    },
  })
  
  const mutation = useMutation({
    mutationFn: async (data: FormData) => {
      try {
        const result = await client.models.TaskManagerConfig.create({
          apiKey: data.apiKey,
          teamId: data.teamId,
        })
        return result
      } catch (error) {
        console.error("Error creating configuration:", error)
        throw new Error("Failed to save configuration")
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tmConfig"] })
      setSubmitStatus("success")
    },
    onError: () => {
      setSubmitStatus("error")
    },
  })

  const handleDisconnect = async () => {
    try {
      // Assuming the first config is the current one
      if (existingConfig?.data?.[0]?.id) {
        await client.models.TaskManagerConfig.delete({ id: existingConfig.data[0].id })
        queryClient.invalidateQueries({ queryKey: ["tmConfig"] })
        setSubmitStatus("idle")
      }
    } catch (error) {
      console.error("Error disconnecting:", error)
    }
  }

  const onSubmit = (data: FormData) => {
    mutation.mutate(data)
  }

  if (isLoadingConfig) {
    return <div>Loading...</div>
  }

  const hasExistingConfig = (existingConfig?.data ?? []).length > 0
  const currentConfig = existingConfig?.data?.[0]

  return (
    <div className="container px-1 py-10 mx-auto">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">{t('title')}</h2>
            <p className="text-muted-foreground">{t('subtitle')}</p>
          </div>
          {/*<Button className="gap-2">
        <Plus className="h-4 w-4" />
        Connect Account
      </Button>*/}
        </div>

        <div className="grid gap-4">  

          {hasExistingConfig ? (
            <ConnectedAccount
              apiKey={currentConfig?.apiKey ?? ""}
              teamId={currentConfig?.teamId ?? ""}
              onDisconnect={handleDisconnect}
            />
          ) : (
            <Card className="w-full max-w-lg">
              <CardHeader>
                <CardTitle>Connect Task Manager</CardTitle>
                <CardDescription>Configure your Task Manager integration settings here.</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="apiKey" className="text-base">
                        API Key
                      </Label>
                      <div className="space-y-1">
                        <Input
                          id="apiKey"
                          {...register("apiKey", { required: "Task Manager API Key is required" })}
                          placeholder="Enter your Task Manager API Key"
                        />
                        {errors.apiKey && <p className="text-sm text-destructive">{errors.apiKey.message}</p>}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="teamId" className="text-base">
                        Team ID
                      </Label>
                      <div className="space-y-1">
                        <Input
                          id="teamId"
                          {...register("teamId", { required: "Task Manager Team ID is required" })}
                          placeholder="Enter your Task Manager Team ID"
                        />
                        {errors.teamId && <p className="text-sm text-destructive">{errors.teamId.message}</p>}
                      </div>
                    </div>
                  </div>

                  {submitStatus === "error" && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>Error</AlertTitle>
                      <AlertDescription>Failed to save settings. Please try again.</AlertDescription>
                    </Alert>
                  )}

                  <Button type="submit" className="w-full" disabled={mutation.status === "pending"}>
                    {mutation.status === "pending" ? "Connecting..." : "Connect Account"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}

