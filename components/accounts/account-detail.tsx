"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { ArrowLeft, Edit } from "lucide-react"
import type { Account } from "@/types/account"
import { DeleteAccountDialog } from "@/components/accounts/delete-account-dialog"
import { useState } from "react"

interface AccountDetailProps {
  account: Account
  locale: string
}

export function AccountDetail({ account, locale }: AccountDetailProps) {
  const [showTaskManagerKey, setShowTaskManagerKey] = useState(false)
  const [showKoboToolboxKey, setShowKoboToolboxKey] = useState(false)

  const maskedValue = "**********"

  return (
    <div className="space-y-6">
      <div>
        <Link
          href={`/${locale}/accounts`}
          className="flex items-center text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to accounts
        </Link>
      </div>

      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{account.domain}</h1>
        <div className="flex gap-2">
          <Link href={`/${locale}/accounts/${account.id}/edit`}>
            <Button variant="outline" size="sm">
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </Button>
          </Link>
          <DeleteAccountDialog accountId={account.id} accountName={account.domain} locale={locale} />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Account Information</CardTitle>
            <CardDescription>Basic details about the account.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="text-sm font-medium text-muted-foreground">Domain</div>
              <div>{account.domain}</div>
            </div>
            <div>
              <div className="text-sm font-medium text-muted-foreground">Created</div>
              <div>{account.createdAt.toLocaleDateString()}</div>
            </div>
            <div>
              <div className="text-sm font-medium text-muted-foreground">Last Updated</div>
              <div>{account.updatedAt.toLocaleDateString()}</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Integration Details</CardTitle>
            <CardDescription>API keys and integration information.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="text-sm font-medium text-muted-foreground">Task Manager Type</div>
              <div>{account.taskManagerType}</div>
            </div>
            <div>
              <div className="text-sm font-medium text-muted-foreground">Task Manager API Key</div>
              <div className="font-mono text-sm">
                {showTaskManagerKey ? account.taskManagerApiKey : maskedValue}
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 ml-2"
                  onClick={() => setShowTaskManagerKey(!showTaskManagerKey)}
                >
                  {showTaskManagerKey ? "Hide" : "Show"}
                </Button>
              </div>
            </div>
            <div>
              <div className="text-sm font-medium text-muted-foreground">Kobo Toolbox API Key</div>
              <div className="font-mono text-sm">
                {showKoboToolboxKey ? account.koboToolboxApiKey : maskedValue}
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 ml-2"
                  onClick={() => setShowKoboToolboxKey(!showKoboToolboxKey)}
                >
                  {showKoboToolboxKey ? "Hide" : "Show"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

