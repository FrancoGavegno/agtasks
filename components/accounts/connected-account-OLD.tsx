import { useTranslations } from 'next-intl';

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Link2, MoreVertical } from 'lucide-react'
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface ConnectedAccountProps {
  apiKey: string
  teamId: string
  onDisconnect: () => void
}

export function ConnectedAccount({ apiKey, teamId, onDisconnect }: ConnectedAccountProps) {
  const t = useTranslations('AccountsPage');
  // Mask the API key to show only the first 10 characters
  const maskedApiKey = `${apiKey.slice(0, 10)}${'*'.repeat(3)}`

  return (
    <Card className="bg-card">
      <CardContent className="pt-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-4">
            <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
              <Link2 className="h-5 w-5 text-muted-foreground" />
            </div>
            <div className="space-y-1">
              <h3 className="font-semibold leading-none">Team ID: {teamId}</h3>
              <p className="text-sm text-muted-foreground">API Key: {maskedApiKey}</p>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreVertical className="h-4 w-4" />
                <span className="sr-only">Open menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem className="text-destructive" onClick={onDisconnect}>
                Disconnect
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="mt-4 flex items-center space-x-4 text-sm">
          <div className="flex items-center">
            <p className="text-muted-foreground">
              Last synced: {new Date().toLocaleString()}
            </p>
          </div>
          <Badge variant="secondary" className="text-success-foreground bg-success/10">
            Connected
          </Badge>
        </div>
      </CardContent>
    </Card>

  )
}
