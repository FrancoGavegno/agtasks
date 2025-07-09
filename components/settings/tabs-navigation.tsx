"use client"

import { useTranslations } from 'next-intl';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from "@/components/ui/tabs"
import Protocols from "./protocols"
import Users from "./users"
// import Roles from "./roles"
import Forms from "./forms"
import { SettingsProvider } from "@/lib/contexts/settings-context"
import type { Project } from '@/lib/interfaces'

interface TabsNavigationProps {
  selectedProject?: Project
}

export default function TabsNavigation({ selectedProject }: TabsNavigationProps) {
  const t = useTranslations("SettingsTabsNavigation")

  return (
    <SettingsProvider selectedProject={selectedProject}>
      <div className="w-full">
        <Tabs defaultValue="protocols" className="w-full">
          <TabsList className="grid grid-cols-3 w-full bg-muted/60 p-1 rounded-lg">
            <TabsTrigger value="protocols" className="rounded-md data-[state=active]:bg-background">
              {t("tab-1")}
            </TabsTrigger>
            <TabsTrigger value="users" className="rounded-md data-[state=active]:bg-background">
              {t("tab-2")}
            </TabsTrigger>
            {/* <TabsTrigger value="roles" className="rounded-md data-[state=active]:bg-background">
              {t("tab-3")}
            </TabsTrigger> */}
            <TabsTrigger value="forms" className="rounded-md data-[state=active]:bg-background">
              {t("tab-4")}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="protocols" className="mt-6">
            <Protocols />
          </TabsContent>

          <TabsContent value="users" className="mt-6">
            <Users />
          </TabsContent>

          {/* <TabsContent value="roles" className="mt-6">
            <Roles />
          </TabsContent> */}

          <TabsContent value="forms" className="mt-6">
            <Forms />
          </TabsContent>
        </Tabs>
      </div>
    </SettingsProvider>
  )
}
