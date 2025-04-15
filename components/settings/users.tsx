"use client"

import { useState } from "react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/hooks/use-toast"
import { User } from "@/lib/interfaces"

export default function Users() {
  const [users, setUsers] = useState<User[]>([
    {
      id: "1",
      firstName: "Nicolas",
      lastName: "Terugi",
      email: "nicolasteruggi@gmail.com",
      invitationStatus: "Not Sent",
    },
    { id: "2", firstName: "Leandro", lastName: "Terugi", email: "leandrugo07@gmail.com", invitationStatus: "Not Sent" },
    { id: "3", firstName: "Evelyn", lastName: "Coronel", email: "ecoronel@gmail.com", invitationStatus: "Not Sent" },
    { id: "4", firstName: "Antonio", lastName: "Di Pollina", email: "tdi@eoagro.com", invitationStatus: "Not Sent" },
    {
      id: "5",
      firstName: "Diego",
      lastName: "Bernardi",
      email: "bernardidiego@gmail.com",
      invitationStatus: "Not Sent",
    },
    { id: "6", firstName: "Federico", lastName: "Picardi", email: "fpicardi@eoagro.com", invitationStatus: "Not Sent" },
    { id: "7", firstName: "Camilo", lastName: "Orlando", email: "corlando@example.com", invitationStatus: "Not Sent" },
  ])

  const [filter, setFilter] = useState("")

  const filteredUsers = users.filter(
    (user) =>
      `${user.firstName} ${user.lastName}`.toLowerCase().includes(filter.toLowerCase()) ||
      user.email.toLowerCase().includes(filter.toLowerCase()),
  )

  function getFullName(user: User): string {
    return `${user.firstName} ${user.lastName}`
  }

  function getInitials(user: User): string {
    return (user.firstName.charAt(0) + user.lastName.charAt(0)).toUpperCase()
  }

  const sendInvitation = (userId: string) => {
    // Simulate sending an invitation
    setTimeout(() => {
      setUsers((prevUsers) =>
        prevUsers.map((user) => (user.id === userId ? { ...user, invitationStatus: "Sent" } : user)),
      )

      // Show a toast notification
      const user = users.find((u) => u.id === userId)
      if (user) {
        toast({
          title: "Invitation sent",
          description: `Invitation email sent to ${user.email}`,
        })
      }
    }, 500) // Simulate a delay for the API call
  }

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-5">
        <div className="space-y-1.5">
          <h2 className="text-xl font-semibold tracking-tight">Users</h2>
          <p className="text-muted-foreground">Manage users and invitations</p>
        </div>
        {/* <Button size="sm">Edit</Button> */}
      </div>

      <div className="mb-5">
        <Input
          placeholder="Filter users..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="max-w-full"
        />
      </div>

      <div className="rounded-md border">
        <div className="grid grid-cols-12 items-center px-4 py-3 bg-muted/50 text-sm">
          <div className="col-span-3 font-medium">Name</div>
          <div className="col-span-4 font-medium">Email</div>
          <div className="col-span-2 font-medium">Invitation Status</div>
          <div className="col-span-3 font-medium">Actions</div>
        </div>

        {filteredUsers.length > 0 ? (
          filteredUsers.map((user) => (
            <div key={user.id} className="grid grid-cols-12 items-center px-4 py-3 border-t text-sm">
              <div className="col-span-3 font-medium flex items-center gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-muted text-muted-foreground text-xs">
                    {getInitials(user)}
                  </AvatarFallback>
                </Avatar>
                <span>{getFullName(user)}</span>
              </div>
              <div className="col-span-4">{user.email}</div>
              <div className="col-span-2">
                <Badge variant={user.invitationStatus === "Sent" ? "default" : "secondary"} className="font-normal">
                  {user.invitationStatus}
                </Badge>
              </div>
              <div className="col-span-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => sendInvitation(user.id)}
                  disabled={user.invitationStatus === "Sent"}
                >
                  {user.invitationStatus === "Sent" ? "Invitation Sent" : "Send Invitation"}
                </Button>
              </div>
            </div>
          ))
        ) : (
          <div className="px-4 py-6 text-center text-sm text-muted-foreground">No users found.</div>
        )}
      </div>

      <div className="flex items-center justify-end mt-4 text-sm text-muted-foreground">
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            Previous
          </Button>
          <Button variant="outline" size="sm">
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}
