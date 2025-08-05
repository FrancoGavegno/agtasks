import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/routing'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  FileText, 
  FolderOpen, 
  Settings, 
  ClipboardList, 
  Wrench,
  Database
} from 'lucide-react'

export default function AdminPage() {
  const t = useTranslations('Admin')

  const adminSections = [
    {
      title: t('DomainProtocols.title'),
      description: t('DomainProtocols.subtitle'),
      href: '/admin/domain-protocols',
      icon: Settings,
      color: 'text-blue-600'
    },
    {
      title: t('DomainForms.title'),
      description: t('DomainForms.subtitle'),
      href: '/admin/domain-forms',
      icon: FileText,
      color: 'text-green-600'
    },
    {
      title: t('Projects.title'),
      description: t('Projects.subtitle'),
      href: '/admin/projects',
      icon: FolderOpen,
      color: 'text-purple-600'
    },
    {
      title: t('Services.title'),
      description: t('Services.subtitle'),
      href: '/admin/services',
      icon: Wrench,
      color: 'text-orange-600'
    },
    {
      title: t('Tasks.title'),
      description: t('Tasks.subtitle'),
      href: '/admin/tasks',
      icon: ClipboardList,
      color: 'text-red-600'
    }
  ]

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">{t('title')}</h1>
        <p className="text-muted-foreground mt-2">{t('subtitle')}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {adminSections.map((section) => {
          const Icon = section.icon
          return (
            <Card key={section.href} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <Icon className={`h-8 w-8 ${section.color}`} />
                  <div>
                    <CardTitle className="text-lg">{section.title}</CardTitle>
                    <CardDescription>{section.description}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Link href={section.href}>
                  <Button className="w-full">
                    {t('manage')}
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
} 