"use client"

import { useState } from "react"
import { Check, ChevronDown } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

type UserType = {
  id: string
  name: string
  avatar: string
}

export default function UserTypeSelector() {
  const [open, setOpen] = useState(false)
  const [selectedUserType, setSelectedUserType] = useState<UserType>({
    id: "administrador",
    name: "Administrador",
    avatar: "AD",
  })

  const userTypes: UserType[] = [
    {
      id: "administrador",
      name: "Administrador",
      avatar: "AD",
    },
    {
      id: "miembro",
      name: "Miembro",
      avatar: "MI",
    },
    {
      id: "stakeholder",
      name: "Stakeholder",
      avatar: "ST",
    },
  ]

  return (
    <div className="w-full max-w-[260px] mx-auto">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" role="combobox" aria-expanded={open} className="w-full justify-between px-3 py-6">
            <div className="flex items-center gap-2">
              <Avatar className="h-6 w-6 bg-gray-700">
                <AvatarFallback>{selectedUserType.avatar}</AvatarFallback>
              </Avatar>
              <span>{selectedUserType.name}</span>
            </div>
            <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[260px] p-0">
          <Command>
            <CommandInput placeholder="Search user type..." className="h-9" />
            <CommandList>
              <CommandEmpty>No user type found.</CommandEmpty>
              <CommandGroup heading="User Types">
                {userTypes.map((userType) => (
                  <CommandItem
                    key={userType.id}
                    onSelect={() => {
                      setSelectedUserType(userType)
                      setOpen(false)
                    }}
                    className="flex items-center gap-2 px-2 py-1.5"
                  >
                    <Avatar className="h-6 w-6 bg-gray-700">
                      <AvatarFallback>{userType.avatar}</AvatarFallback>
                    </Avatar>
                    <span>{userType.name}</span>
                    {selectedUserType.id === userType.id && <Check className="ml-auto h-4 w-4" />}
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

