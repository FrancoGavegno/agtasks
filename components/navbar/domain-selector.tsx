"use client"

import { useState } from "react"
import { 
  Check, 
  ChevronsUpDown, 
  Plus, 
  Settings 
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
import { Domain } from "@/lib/interfaces/360"
import { type Project } from "@/lib/schemas"
import { Link } from "@/i18n/routing"

interface Props {
  domains: Domain[]
  projects: Project[]
  selectedDomain?: Domain
  selectedProject?: Project
  onDomainSelect: (domain: Domain) => void
  onProjectSelect: (project: Project) => void
  onCreateProject: () => void
}

export default function DomainProjectSelector({
  domains,
  projects,
  selectedDomain,
  selectedProject,
  onDomainSelect,
  onProjectSelect,
  onCreateProject
}: Props) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState("")

  // Filtrar proyectos por dominio seleccionado
  const filteredProjects = selectedDomain
    ? projects.filter(p => {
        const projectDomainId = String(p.domainId);
        const selectedDomainId = String(selectedDomain.id);
        return projectDomainId === selectedDomainId;
      })
    : []

  return (
    <div className="w-full max-w-xs">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            role="combobox"
            aria-expanded={open}
            className="w-64 h-12 px-3 py-1 flex items-center justify-between rounded-lg bg-white hover:bg-gray-100 focus:ring-2 focus:ring-primary/20 transition-all border-0 shadow-none"
            style={{ boxShadow: 'none', border: 'none' }}
          >
            <div className="flex flex-row items-end justify-between w-full gap-4">
              {/* Dominio */}
              <div className="flex flex-col min-w-0 max-w-[48%]">
                <span className="text-[10px] text-gray-400 leading-none mb-0.5">Dominio</span>
                <span className="text-sm font-medium truncate" style={{lineHeight: '1.2'}}>{selectedDomain?.name ?? "Seleccionar dominio"}</span>
              </div>
              {/* Proyecto */}
              <div className="flex flex-col min-w-0 max-w-[48%]">
                <span className="text-[10px] text-gray-400 leading-none mb-0.5">Proyecto</span>
                <span className="text-sm font-medium truncate" style={{lineHeight: '1.2'}}>{selectedProject?.name ?? "Seleccionar proyecto"}</span>
              </div>
            </div>
            <ChevronsUpDown className="ml-2 h-5 w-5 shrink-0 opacity-70" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-72 p-0 border border-gray-200 shadow-xl rounded-lg">
          <Command className="bg-white rounded-lg">
            <CommandInput
              placeholder="Buscar dominio o proyecto..."
              className="h-9 px-3 text-sm border-0 border-b border-gray-200 focus:border-primary/40 focus:ring-0 rounded-none shadow-none bg-white"
              value={search}
              onValueChange={setSearch}
            />
            <CommandList className="max-h-72 overflow-y-auto">
              <CommandEmpty>
                <span className="block px-4 py-2 text-sm text-gray-400">No se encontró dominio o proyecto.</span>
              </CommandEmpty>
              <CommandGroup heading={<span className="text-xs font-semibold text-gray-500 px-3 py-1">Dominios</span>}>
                {domains.map((domain) => (
                  <CommandItem
                    key={domain.id}
                    onSelect={() => {
                      onDomainSelect(domain)
                    }}
                    className={
                      `flex items-center gap-2 px-3 py-2 text-sm cursor-pointer rounded-md transition-colors
                      ${selectedDomain?.id === domain.id ? 'bg-gray-100 text-primary' : 'hover:bg-gray-50'}
                      `
                    }
                  >
                    <span className="truncate max-w-[140px]">{domain.name}</span>
                    {selectedDomain?.id === domain.id && (
                      <span className="flex items-center gap-1 ml-auto">
                        <Check className="h-4 w-4 text-primary" />
                        <Link
                          href={`/domains/${domain.id}/settings`}
                          className="p-0.5 ml-1 rounded hover:bg-gray-200"
                          tabIndex={0}
                          onClick={e => {
                            e.stopPropagation();
                            setOpen(false);
                          }}
                        >
                          <Settings className="h-4 w-4 text-gray-500" />
                        </Link>
                      </span>
                    )}
                  </CommandItem>
                ))}
              </CommandGroup>
              <div className="my-1 border-t border-gray-100" />
              <CommandGroup heading={<span className="text-xs font-semibold text-gray-500 px-3 py-1">Proyectos</span>}>
                {filteredProjects.length > 0 ? filteredProjects.map((project) => (
                  <CommandItem
                    key={project.id}
                    onSelect={() => {
                      onProjectSelect(project)
                      setOpen(false)
                    }}
                    className={
                      `flex items-center gap-2 px-3 py-2 text-sm cursor-pointer rounded-md transition-colors
                      ${selectedProject?.id === project.id ? 'bg-gray-100 text-primary' : 'hover:bg-gray-50'}
                      `
                    }
                  >
                    <span className="truncate max-w-[170px]">{project.name}</span>
                    {selectedProject?.id === project.id && <Check className="ml-auto h-4 w-4 text-primary" />}
                  </CommandItem>
                )) : (
                  <span className="block px-4 py-2 text-xs text-gray-400">No hay proyectos en este dominio.</span>
                )}
                <CommandItem
                  onSelect={() => {
                    setOpen(false)
                    onCreateProject()
                  }}
                  className="flex items-center gap-2 px-3 py-2 text-sm text-primary cursor-pointer rounded-md hover:bg-gray-50 mt-1"
                >
                  <Plus className="h-4 w-4" /> Crear Proyecto
                </CommandItem>
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  )
}
