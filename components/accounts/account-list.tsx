"use client"

import { Link } from '@/i18n/routing'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, PlusCircle, Search, X } from "lucide-react"
import { useState } from "react"
import type { Account } from "@/types/account"

interface AccountListProps {
  accounts: Account[]
  locale: string
}

export function AccountList({ accounts: initialAccounts, locale }: AccountListProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [accounts, setAccounts] = useState(initialAccounts)

  const handleSearch = (term: string) => {
    setSearchTerm(term)

    if (!term.trim()) {
      setAccounts(initialAccounts)
      return
    }

    const lowercaseTerm = term.toLowerCase()
    const filtered = initialAccounts.filter(
      (account) =>
        account.domain.toLowerCase().includes(lowercaseTerm) ||
        account.taskManagerType.toLowerCase().includes(lowercaseTerm),
    )

    setAccounts(filtered)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Accounts</h1>
        <Link href={`/accounts/create`}>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Account
          </Button>
        </Link>
      </div>

      <div>
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search..."
            className="w-full pl-8 pr-10"
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
          />
          {searchTerm && (
            <button
              className="absolute right-2.5 top-2.5 text-muted-foreground hover:text-foreground"
              onClick={() => handleSearch("")}
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Domain</TableHead>
              <TableHead>Task Manager</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {accounts.length > 0 ? (
              accounts.map((account) => (
                <TableRow key={account.id}>
                  <TableCell className="font-medium">{account.domain}</TableCell>
                  <TableCell>{account.taskManagerType}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Link href={`/accounts/${account.id}`}>
                        <Button variant="ghost" size="sm">
                          View
                        </Button>
                      </Link>
                      <Link href={`/accounts/${account.id}/edit`}>
                        <Button variant="ghost" size="sm">
                          Edit
                        </Button>
                      </Link>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3} className="h-24 text-center">
                  No accounts found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

