"use client"

import { useTranslations } from 'next-intl';
// import { Link } from '@/i18n/routing';

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Check, Link2, MoreVertical, Plus, RefreshCw } from 'lucide-react'

interface ConnectedAccount {
  id: string
  name: string
  type: string
  email: string
  lastSync: string
  status: "connected" | "disconnected"
}

// Mock data - in a real app this would come from your backend
const connectedAccounts: ConnectedAccount[] = [
  {
    id: "1",
    name: "TEST_FG",
    type: "Clickup",
    email: "fgavegno@geoagro.com",
    lastSync: "2024-12-20T10:30:00",
    status: "connected"
  }
]

// const connectedAccounts: ConnectedAccount[] = []

export function Account() {
  const t = useTranslations('AccountsPage');

  return (
    <div className="container px-1 py-10 mx-auto">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">{t('title')}</h2>
            <p className="text-muted-foreground">{t('subtitle')}</p>
          </div>
          {/*<Button className="gap-2">
          <Plus className="h-4 w-4" />
          Connect Account
        </Button>*/}
        </div>

        <div className="grid gap-4">
          {connectedAccounts.map((account) => (
            <Card key={account.id}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="flex items-center space-x-4">
                  <div className="rounded-full bg-primary/10 p-2">
                    <Link2 className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{account.name}</CardTitle>
                    <CardDescription>{account.type}</CardDescription>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem>
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Sync now
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-destructive">
                      Disconnect account
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </CardHeader>
              <CardContent>
                <div className="grid gap-1">
                  <div className="text-sm text-muted-foreground">
                    {t('connectedEmail')}: {account.email}
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center text-sm text-muted-foreground">
                      {t('lastSynced')}: {new Date(account.lastSync).toLocaleString()}
                    </div>
                    <div className="flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700">
                      <Check className="h-3 w-3" />
                      {t('connected')}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {connectedAccounts.length === 0 && (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-8 text-center">
                <Link2 className="h-8 w-8 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold">{t('noAccountTitle')}</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {t('noAccountSubtitle')}
                </p>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  {t('noAccountButton')}
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}

