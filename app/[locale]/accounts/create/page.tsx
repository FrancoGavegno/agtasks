import { AccountForm } from "@/components/accounts/account-form"

interface NewAccountPageProps {
  params: {
    locale: string
  }
}

export default function NewAccountPage({ params }: NewAccountPageProps) {
  return (
    <div className="container mx-auto py-10">
      <AccountForm locale={params.locale || "en"} />
    </div>
  )
}

