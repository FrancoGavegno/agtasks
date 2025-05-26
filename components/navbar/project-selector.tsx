"use client"

import { useState } from "react"
import { 
  Check, 
  ChevronDown 
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from "@/components/ui/command"
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from "@/components/ui/popover"
import { Project } from "@/lib/interfaces"

interface Props {
  projects: Project[]
  selectedProject: Project
  onProjectSelect: (project: Project) => void 
}

export default function ProjectSelector({ projects, selectedProject, onProjectSelect }: Props) {
  const [open, setOpen] = useState(false)
  
  return (
    <div className="w-full max-w-[260px] mx-auto mb-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" role="combobox" aria-expanded={open} className="w-full justify-between px-3 py-6">
            <div className="flex items-center gap-2">
              <span>{selectedProject?.name ?? "Select project"}</span>
            </div>
            <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[260px] p-0">
          <Command>
            <CommandInput placeholder="Search project..." className="h-9" />
            <CommandList>
              <CommandEmpty>No projects found.</CommandEmpty>
              <CommandGroup heading="Projects">
                {projects.map((project) => (
                  <CommandItem
                    key={project.id}
                    onSelect={() => {
                      onProjectSelect(project)
                      setOpen(false)
                    }}
                    className="flex items-center gap-2 px-2 py-1.5"
                  >
                    <span>{project.name}</span>
                    {selectedProject?.id === project.id && <Check className="ml-auto h-4 w-4" />}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  )
}
