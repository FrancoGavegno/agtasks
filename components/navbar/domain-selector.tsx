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
import { Domain } from "@/lib/interfaces"

interface Props {
  domains: Domain[]
  selectedDomain: Domain
  onDomainSelect: (domain: Domain) => void 
}

export default function DomainSelector({ domains, selectedDomain, onDomainSelect }: Props) {
  const [open, setOpen] = useState(false)

  return (
    <div className="w-full max-w-[260px] mx-auto mb-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" role="combobox" aria-expanded={open} className="w-full justify-between px-3 py-6">
            <div className="flex items-center gap-2">
              <span>{selectedDomain?.name ?? "Select domain"}</span>
            </div>
            <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[260px] p-0">
          <Command>
            <CommandInput placeholder="Search domain..." className="h-9" />
            <CommandList>
              <CommandEmpty>No domain found.</CommandEmpty>
              <CommandGroup heading="Domains">
                {domains.map((domain) => (
                  <CommandItem
                    key={domain.id}
                    onSelect={() => {
                      setOpen(false)
                      onDomainSelect(domain) 
                    }}
                    className="flex items-center gap-2 px-2 py-1.5"
                  >
                    <span>{domain.name}</span>
                    {selectedDomain?.id === domain.id && <Check className="ml-auto h-4 w-4" />}
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
