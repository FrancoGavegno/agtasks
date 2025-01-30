"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { DataSourceSection } from "./data-source-section"
import { TaskTypeSection } from "./task-type-section"
import { DateSection } from "./date-section"
import { ProductsSection } from "./products-section"
import { AssigneesSection } from "./assignees-section"
import { ProjectSection } from "./project-section"

export function TaskCreate() {
  interface Product {
    id: string;
    name: string;
    type: "Sólido" | "Líquido";
    nitrogen: number;
    phosphate: number;
    potassium: number;
  }

  const [formData, setFormData] = useState<{
    taskType: string;
    startDate: string;
    endDate: string;
    products: Product[];
    assignees: any[];
    projectId: string;
  }>({
    taskType: "",
    startDate: "",
    endDate: "",
    products: [],
    assignees: [],
    projectId: ""
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Form submitted:", formData)
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-6 max-w-4xl mx-auto">
        <Card>
          <CardContent className="p-6">
            <DataSourceSection />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <TaskTypeSection 
              value={formData.taskType}
              onChange={(value) => setFormData(prev => ({ ...prev, taskType: value }))}
            />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <DateSection
              startDate={formData.startDate}
              endDate={formData.endDate}
              onStartDateChange={(value) => setFormData(prev => ({ ...prev, startDate: value }))}
              onEndDateChange={(value) => setFormData(prev => ({ ...prev, endDate: value }))}
            />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <ProductsSection
              products={formData.products}
              onChange={(products) => setFormData(prev => ({ ...prev, products }))}
            />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <AssigneesSection
              assignees={formData.assignees}
              onChange={(assignees) => setFormData(prev => ({ ...prev, assignees }))}
            />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <ProjectSection
              selectedProject={formData.projectId}
              onProjectChange={(projectId) => setFormData(prev => ({ ...prev, projectId }))}
            />
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4">
          <Button variant="outline" type="button">Cancel</Button>
          <Button type="submit">Create Task</Button>
        </div>
      </div>
    </form>
  )
}

