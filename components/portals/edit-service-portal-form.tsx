"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import { getServicePortalById, updateServicePortal } from "@/lib/db"
import { DOMAINS, AREAS, WORKSPACES, SERVICE_PROJECTS } from "@/lib/types"

interface EditServicePortalFormProps {
  portalId: string
}

export function EditServicePortalForm({ portalId }: EditServicePortalFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    domain: "",
    area: "",
    workspace: "",
    servicePortal: "",
  })

  useEffect(() => {
    const fetchServicePortal = async () => {
      setIsLoading(true)
      try {
        const portal = await getServicePortalById(portalId)
        if (portal) {
          setFormData({
            name: portal.name,
            domain: portal.domain,
            area: portal.area,
            workspace: portal.workspace,
            servicePortal: portal.servicePortal,
          })
        } else {
          throw new Error("Service portal not found")
        }
      } catch (error) {
        console.error("Error fetching portal:", error)
        toast({
          title: "Error",
          description: "Failed to load service portal",
          variant: "destructive",
        })
        router.push("/")
      } finally {
        setIsLoading(false)
      }
    }

    fetchServicePortal()
  }, [portalId, router])

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

      // Update service portal
      const updated = await updateServicePortal(portalId, formData)

      if (!updated) {
        throw new Error("Failed to update service portal")
      }

      toast({
        title: "Success",
        description: "Service portal updated successfully",
      })

      // Redirect to main page
      router.push("/")
    } catch (error) {
      console.error("Error updating portal:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update service portal",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-40">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <>
      <div className="mb-6">
        <Button variant="outline" className="flex items-center gap-2" onClick={() => router.push("/")}>
          <ArrowLeft className="h-4 w-4" />
          Back to Service Portals
        </Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Service portal name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  placeholder="Enter service portal name"
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="domain">Domain</Label>
                <Select value={formData.domain} onValueChange={(value) => handleChange("domain", value)} required>
                  <SelectTrigger id="domain">
                    <SelectValue placeholder="Select domain" />
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
                <Label htmlFor="area">Area</Label>
                <Select value={formData.area} onValueChange={(value) => handleChange("area", value)} required>
                  <SelectTrigger id="area">
                    <SelectValue placeholder="Select area" />
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
                    <SelectValue placeholder="Select workspace" />
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
                <Label htmlFor="servicePortal">Service project</Label>
                <Select
                  value={formData.servicePortal}
                  onValueChange={(value) => handleChange("servicePortal", value)}
                  required
                >
                  <SelectTrigger id="servicePortal">
                    <SelectValue placeholder="Select service project" />
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

            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => router.push("/")} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : "Save"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </>
  )
}

