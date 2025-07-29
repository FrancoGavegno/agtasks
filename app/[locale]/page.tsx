import { useTranslations } from 'next-intl'

export default function AdminPage() {
  return (
    <div className="min-h-screen space-y-6">
      <div className="mt-4">
        <h1 className="text-3xl font-bold">Agtasks</h1>
        <p className="text-muted-foreground">Manage all your application data from this central admin panel.</p>
      </div>
    </div>
  )
}