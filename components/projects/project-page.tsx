"use client"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Overview from "@/components/projects/overview"
import { Services } from "@/components/projects/services"
import { Tasks } from "@/components/projects/tasks"


export function ProjectDetails() {
  return (
    <div className="w-full">
      <Overview />
    </div>
  )
}
