import { Domain } from "@/lib/interfaces"
import TabsNavigation from "@/components/settings/tabs-navigation"

interface Props {
  domain: number
}

export default function SettingsPage({ domain }: Props) {
  return (
    <div className="container w-full py-10">
      <div className="flex justify-between items-center mb-5">
        <div className="space-y-1.5">
          <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
          <p className="text-muted-foreground">Manage your domain settings</p>
        </div>
      </div>

      <TabsNavigation />
    </div>
  )
}
