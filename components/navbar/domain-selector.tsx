"use client"

import { useState, useEffect } from "react"
import { Check, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { User, Domain } from "@/lib/interfaces"
import { listDomains } from "@/lib/360"

interface Props {
  user: User
  onDomainSelect: (domainId: number) => void 
}

export default function DomainSelector({ user, onDomainSelect }: Props) {
  const [open, setOpen] = useState(false)
  const [domains, setDomains] = useState<Domain[]>([])
  const [selectedDomain, setSelectedDomain] = useState<Domain>()

  useEffect(() => {
    const fetchDomains = async () => {
      const domainsData = await listDomains(user.id)
      setDomains(domainsData)
      setSelectedDomain(domainsData[0])
      if (domainsData[0]) {
        onDomainSelect(domainsData[0].id) 
      }
    }

    fetchDomains()
  }, [user.id, onDomainSelect])

  return (
    <div className="w-full max-w-[260px] mx-auto mb-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" role="combobox" aria-expanded={open} className="w-full justify-between px-3 py-6">
            <div className="flex items-center gap-2">
              <span>{selectedDomain?.name}</span>
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
                      onDomainSelect(domain.id) 
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



