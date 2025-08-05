"use client"

import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/routing'
import { ChevronRight, Home } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'

interface AdminLayoutProps {
  children: React.ReactNode
  title: string
  subtitle?: string
  breadcrumbs?: Array<{
    label: string
    href?: string
  }>
  actions?: React.ReactNode
}

export function AdminLayout({ 
  children, 
  title, 
  subtitle, 
  breadcrumbs = [],
  actions 
}: AdminLayoutProps) {
  const t = useTranslations('Common')

  const defaultBreadcrumbs = [
    { label: t('home'), href: '/' },
    { label: t('admin'), href: '/admin' }
  ]

  const allBreadcrumbs = [...defaultBreadcrumbs, ...breadcrumbs]

  return (
    <div className="container mx-auto py-8">
      {/* Breadcrumbs */}
      <nav className="flex items-center space-x-1 text-sm text-muted-foreground mb-6">
        {allBreadcrumbs.map((crumb, index) => (
          <div key={index} className="flex items-center">
            {crumb.href ? (
              <Link 
                href={crumb.href}
                className="hover:text-foreground transition-colors"
              >
                {index === 0 ? <Home className="h-4 w-4" /> : crumb.label}
              </Link>
            ) : (
              <span className="text-foreground font-medium">{crumb.label}</span>
            )}
            {index < allBreadcrumbs.length - 1 && (
              <ChevronRight className="h-4 w-4 mx-1" />
            )}
          </div>
        ))}
      </nav>

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">{title}</h1>
          {subtitle && (
            <p className="text-muted-foreground mt-2">{subtitle}</p>
          )}
        </div>
        {actions && (
          <div className="flex items-center space-x-2">
            {actions}
          </div>
        )}
      </div>

      <Separator className="mb-6" />

      {/* Content */}
      {children}
    </div>
  )
} 