import { AccountDetail } from "@/components/accounts/account-detail"
import { getAccountById } from "@/lib/data"
import { notFound } from "next/navigation"

interface AccountDetailPageProps {
  params: {
    locale: string
    id: string
  }
}

export default function AccountDetailPage({ params }: AccountDetailPageProps) {
  const account = getAccountById(params.id)

  if (!account) {
    notFound()
  }

  return (
    <div className="container mx-auto py-10">
      <AccountDetail account={account} locale={params.locale} />
    </div>
  )
}

