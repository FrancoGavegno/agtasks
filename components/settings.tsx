"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Key, Loader2 } from 'lucide-react'

import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
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
import { useToast } from "@/hooks/use-toast"
//import { useToast } from "@/components/ui/use-toast"

const formSchema = z.object({
    geoagroApiKey: z.string(),
    clientApiKey: z.string().min(1, {
        message: "Client API Key is required.",
    }),
})

interface SettingsProps {
    geoagroApiKey: string
}

export function Settings({ geoagroApiKey }: SettingsProps) {
    const [isLoading, setIsLoading] = useState(false)
    const { toast } = useToast()

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            geoagroApiKey: geoagroApiKey,
            clientApiKey: "",
        },
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            setIsLoading(true)
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000))
            console.log(values)

            toast({
                title: "Settings updated",
                description: "Your API settings have been saved successfully.",
            })
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to update settings. Please try again.",
                variant: "destructive",
            })
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="container py-10 mx-auto">
            <Card>
                <CardHeader>
                    <CardTitle>API Settings</CardTitle>
                    <CardDescription>
                        Configure your GeoAgro and client API keys 
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                            <FormField
                                control={form.control}
                                name="geoagroApiKey"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>GeoAgro API Key</FormLabel>
                                        <FormControl>
                                            <div className="flex">
                                                <Key className="w-4 h-4 text-muted-foreground mr-2 mt-2" />
                                                <Input
                                                    {...field}
                                                    disabled
                                                    className="font-mono"
                                                />
                                            </div>
                                        </FormControl>
                                        <FormDescription>
                                            Your GeoAgro API key (read-only)
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="clientApiKey"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Client API Key</FormLabel>
                                        <FormControl>
                                            <div className="flex">
                                                <Key className="w-4 h-4 text-muted-foreground mr-2 mt-2" />
                                                <Input
                                                    {...field}
                                                    placeholder="Enter client API key"
                                                    className="font-mono"
                                                />
                                            </div>
                                        </FormControl>
                                        <FormDescription>
                                            Enter your client&apos;s API key for integration
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <div className="flex justify-end">
                                <Button type="submit" disabled={isLoading}>
                                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    {isLoading ? "Saving..." : "Save Settings"}
                                </Button>
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    )
}

