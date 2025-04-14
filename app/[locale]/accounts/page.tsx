import { AccountList } from "@/components/accounts/account-list"
import { getAccounts } from "@/lib/data"

interface AccountsPageProps {
  params: {
    locale: string
  }
}

export default function AccountsPage({ params }: AccountsPageProps) {
  const accounts = getAccounts()

  return (
    <div className="container mx-auto py-10">
      <AccountList accounts={accounts} locale={params.locale} />
    </div>
  )
}

