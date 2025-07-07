"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createDomainForm, updateDomainForm } from "@/lib/admin-actions"
import type { Schema } from "@/amplify/data/resource"

type DomainForm = Schema["DomainForm"]["type"]

interface DomainFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  domainForm?: DomainForm | null
}

export function DomainFormDialog({ open, onOpenChange, domainForm }: DomainFormDialogProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    domainId: "",
    ktFormId: "",
    name: "",
    language: "",
  })

  // Auto-populate form when editing
  useEffect(() => {
    if (domainForm) {
      setFormData({
        domainId: domainForm.domainId || "",
        ktFormId: domainForm.ktFormId || "",
        name: domainForm.name || "",
        language: domainForm.language || "",
      })
    } else {
      // Reset form for create mode
      setFormData({
        domainId: "",
        ktFormId: "",
        name: "",
        language: "",
      })
    }
  }, [domainForm, open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const result = domainForm ? await updateDomainForm(domainForm.id, formData) : await createDomainForm(formData)

      if (result.success) {
        onOpenChange(false)
      } else {
        alert(result.error || "An error occurred")
      }
    } catch (error) {
      alert("An unexpected error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{domainForm ? "Edit Domain Form" : "Create Domain Form"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              disabled={isLoading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="domainId">Domain ID *</Label>
            <Input
              id="domainId"
              value={formData.domainId}
              onChange={(e) => setFormData({ ...formData, domainId: e.target.value })}
              required
              disabled={isLoading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="ktFormId">KT Form ID *</Label>
            <Input
              id="ktFormId"
              value={formData.ktFormId}
              onChange={(e) => setFormData({ ...formData, ktFormId: e.target.value })}
              required
              disabled={isLoading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="language">Language *</Label>
            <Input
              id="language"
              value={formData.language}
              onChange={(e) => setFormData({ ...formData, language: e.target.value })}
              required
              disabled={isLoading}
            />
          </div>
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (domainForm ? "Updating..." : "Creating...") : domainForm ? "Update" : "Create"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
