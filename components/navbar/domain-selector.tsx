"use client"

import { useState } from "react"
import { Check, ChevronDown } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

type Domain = {
  id: string
  name: string
  avatar: string
}

export default function DomainSelector() {
  const [open, setOpen] = useState(false)
  const [selectedDomain, setSelectedDomain] = useState<Domain>({
    id: "geoagro",
    name: "GeoAgro",
    avatar: "GA",
  })

  const domains: Domain[] = [
    {
      id: "geoagro",
      name: "GeoAgro",
      avatar: "GA",
    },
    {
      id: "conci",
      name: "Conci",
      avatar: "CO",
    },
    {
      id: "rigran",
      name: "Rigran",
      avatar: "RI",
    },
    {
      id: "prodas",
      name: "Prodas Advanced",
      avatar: "PA",
    },
  ]

  return (
    <div className="w-full max-w-[260px] mx-auto">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" role="combobox" aria-expanded={open} className="w-full justify-between px-3 py-6">
            <div className="flex items-center gap-2">
              <Avatar className="h-6 w-6 bg-gray-700">
                <AvatarFallback>{selectedDomain.avatar}</AvatarFallback>
              </Avatar>
              <span>{selectedDomain.name}</span>
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
                      setSelectedDomain(domain)
                      setOpen(false)
                    }}
                    className="flex items-center gap-2 px-2 py-1.5"
                  >
                    <Avatar className="h-6 w-6 bg-gray-700">
                      <AvatarFallback>{domain.avatar}</AvatarFallback>
                    </Avatar>
                    <span>{domain.name}</span>
                    {selectedDomain.id === domain.id && <Check className="ml-auto h-4 w-4" />}
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


