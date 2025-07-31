"use client"

import { Link } from "@/i18n/routing"
import { useTranslations } from 'next-intl'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

interface BreadcrumbWithTranslationsProps {
  items: Array<{
    label: string
    href?: string
    isCurrent?: boolean
    translationKey?: string
  }>
  className?: string
}

export function BreadcrumbWithTranslations({ items, className = "mb-4" }: BreadcrumbWithTranslationsProps) {
  const t = useTranslations()

  return (
    <Breadcrumb className={className}>
      <BreadcrumbList>
        {items.map((item, index) => (
          <div key={index} className="flex items-center">
            {index > 0 && <BreadcrumbSeparator />}
            <BreadcrumbItem>
              {item.isCurrent ? (
                <BreadcrumbPage>
                  {item.translationKey ? t(item.translationKey) : item.label}
                </BreadcrumbPage>
              ) : item.href ? (
                <Link href={item.href}>
                  {item.translationKey ? t(item.translationKey) : item.label}
                </Link>
              ) : (
                <span>
                  {item.translationKey ? t(item.translationKey) : item.label}
                </span>
              )}
            </BreadcrumbItem>
          </div>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  )
} 