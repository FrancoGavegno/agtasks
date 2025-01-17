"use client"

import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { formTypes } from "@/utils/mockData";


interface FormTypeSelectorProps {
  onSelect: (value: any) => void;
}

export default function FormTypeSelector({ onSelect }: FormTypeSelectorProps) {
  return (
    <div className="space-y-2">
      
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Form Type Selection</h2>
        <p className="text-sm text-muted-foreground">
          Step 1
        </p>
      </div>
      
      <Select onValueChange={(value) => onSelect(JSON.parse(value))}>
        <SelectTrigger>
          <SelectValue placeholder="Select a form type" />
        </SelectTrigger>
        <SelectContent>
          {formTypes.map((form) => {
            const Icon = form.icon
            return (
              <SelectItem key={form.title} value={JSON.stringify(form)} className="w-full">
                <div className="flex items-start gap-3 w-full">
                  <Icon className="w-5 h-5 mt-0.5 shrink-0" />
                  <div className="text-left">
                    <div className="font-medium">{form.title}</div>
                    <div className="text-sm text-muted-foreground">{form.description}</div>
                  </div>
                </div>
              </SelectItem>
            )
          })}
        </SelectContent>
      </Select>
    </div>
  )
}

