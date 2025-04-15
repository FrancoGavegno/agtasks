"use client"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Protocols from "@/components/settings/protocols"
import Users from "@/components/settings/users"
import Roles from "@/components/settings/roles"
import Forms from "@/components/settings/forms"

export default function TabsNavigation() {
  return (
    <div className="w-full">
      <Tabs defaultValue="protocols" className="w-full">
        <TabsList className="grid grid-cols-4 w-full bg-muted/60 p-1 rounded-lg">
          <TabsTrigger value="protocols" className="rounded-md data-[state=active]:bg-background">
            Protocols
          </TabsTrigger>
          <TabsTrigger value="users" className="rounded-md data-[state=active]:bg-background">
            Users
          </TabsTrigger>
          <TabsTrigger value="roles" className="rounded-md data-[state=active]:bg-background">
            Roles
          </TabsTrigger>
          <TabsTrigger value="forms" className="rounded-md data-[state=active]:bg-background">
            Forms
          </TabsTrigger>
        </TabsList>

        <TabsContent value="protocols" className="mt-6">
          <Protocols />
        </TabsContent>

        <TabsContent value="users" className="mt-6">
          <Users />
        </TabsContent>

        <TabsContent value="roles" className="mt-6">
          <Roles />
        </TabsContent>

        <TabsContent value="forms" className="mt-6">
          <Forms />
        </TabsContent>
      </Tabs>
    </div>
  )
}
