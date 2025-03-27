"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import { createServicePortal } from "@/lib/db"
import { DOMAINS, AREAS, WORKSPACES, SERVICE_PROJECTS } from "@/lib/types"
import { Link } from "@/i18n/routing"

export function NewServicePortalForm() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    domain: "",
    area: "",
    workspace: "",
    servicePortal: "",
  })

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Validate form data
      if (!formData.name || !formData.domain || !formData.area || !formData.workspace || !formData.servicePortal) {
        throw new Error("All fields are required")
      }

      // Create service portal
      await createServicePortal(formData)

      toast({
        title: "Success",
        description: "Service portal created successfully",
      })

      // Redirect to main page
      router.push("/en/portals")
    } catch (error) {
      console.error("Error creating portal:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create service portal",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">

      <div>
        <Link href="/portals"
          className="group flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
          Back to Service Portals
        </Link>
      </div>


      <Card>
        <CardHeader>
          <CardTitle>Create New Service Portal</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Portal Name <span className="text-red-500">*</span></Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  placeholder=""
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="domain">Domain <span className="text-red-500">*</span></Label>
                <Select value={formData.domain} onValueChange={(value) => handleChange("domain", value)} required>
                  <SelectTrigger id="domain">
                    <SelectValue placeholder="" />
                  </SelectTrigger>
                  <SelectContent>
                    {DOMAINS.map((d) => (
                      <SelectItem key={d} value={d}>
                        {d}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="area">Area <span className="text-red-500">*</span></Label>
                <Select value={formData.area} onValueChange={(value) => handleChange("area", value)} required>
                  <SelectTrigger id="area">
                    <SelectValue placeholder="" />
                  </SelectTrigger>
                  <SelectContent>
                    {AREAS.map((a) => (
                      <SelectItem key={a} value={a}>
                        {a}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="workspace">Workspace</Label>
                <Select value={formData.workspace} onValueChange={(value) => handleChange("workspace", value)} required>
                  <SelectTrigger id="workspace">
                    <SelectValue placeholder="" />
                  </SelectTrigger>
                  <SelectContent>
                    {WORKSPACES.map((w) => (
                      <SelectItem key={w} value={w}>
                        {w}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="servicePortal">Task Manager Project <span className="text-red-500">*</span></Label>
                <Select
                  value={formData.servicePortal}
                  onValueChange={(value) => handleChange("servicePortal", value)}
                  required
                >
                  <SelectTrigger id="servicePortal">
                    <SelectValue placeholder="" />
                  </SelectTrigger>
                  <SelectContent>
                    {SERVICE_PROJECTS.map((p) => (
                      <SelectItem key={p} value={p}>
                        {p}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex gap-2 pt-4">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : "Confirm"}
              </Button>
              <Link href="/portals">
                <Button variant="outline" type="button">
                  Cancel
                </Button>
              </Link>
            </div>

          </form>
        </CardContent>
      </Card>
    </div>
  )
}

