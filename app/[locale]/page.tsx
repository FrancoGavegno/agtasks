"use client"

import { useTranslations } from 'next-intl'

export default function AdminPage() {
  const t = useTranslations("HomePage")
  
  return (
    <div className="min-h-screen space-y-6">
      <div className="mt-4">
        <h1 className="text-3xl font-bold">{t("title")}</h1>
        <p className="text-muted-foreground">{t("subtitle")}</p>        
      </div>
    </div>
  )
}