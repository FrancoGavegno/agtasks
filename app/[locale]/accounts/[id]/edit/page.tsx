import { AccountForm } from "@/components/accounts/account-form"
import { getAccountById } from "@/lib/data"
import { notFound } from "next/navigation"

interface EditAccountPageProps {
  params: {
    locale: string
    id: string
  }
}

export default function EditAccountPage({ params }: EditAccountPageProps) {
  const account = getAccountById(params.id)

  if (!account) {
    notFound()
  }

  return (
    <div className="container mx-auto py-10">
      <AccountForm account={account} locale={params.locale || "en"} isEditing />
    </div>
  )
}

