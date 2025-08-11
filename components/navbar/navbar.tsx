"use client"

import { Link } from '@/i18n/routing'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import { LanguageSelector } from "@/components/language-selector"
import DomainProjectSelector from "@/components/navbar/domain-selector"
import { Domain } from "@/lib/interfaces/360"
import { type Project } from "@/lib/schemas"

interface NavbarProps {
  domains: Domain[]
  projects: Project[]
  selectedDomain?: Domain
  selectedProject?: Project
  setSelectedDomain: (domain: Domain) => void
  setSelectedProject: (project: Project) => void
}

export function Navbar({
  domains,
  projects,
  selectedDomain,
  selectedProject,
  setSelectedDomain,
  setSelectedProject
}: NavbarProps) {
  const t = useTranslations("Navbar")

  const handleCreateProject = () => {
    // TO DO: Abrir un modal o redirigir 
    // a la página de creación de proyecto
    alert('Crear Proyecto')
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center mx-auto">
        <Link href="/" className="font-bold mr-auto flex items-center gap-2">
          <Image
            src="/agtasks-logo.png"
            alt="AgTasks Logo"
            width={32}
            height={32}
            className="object-contain"
          />
          <span>Agtasks</span>
        </Link>
        <div className="flex items-center space-x-4">
          <DomainProjectSelector
            domains={domains}
            projects={projects}
            selectedDomain={selectedDomain}
            selectedProject={selectedProject}
            onDomainSelect={setSelectedDomain}
            onProjectSelect={setSelectedProject}
            onCreateProject={handleCreateProject}
          />
          <nav>
            <div className="flex items-center space-x-4">
              {/* TODO: Reemplazar con componentes de autenticación del microservicio de Auth */}
              <div className="text-sm text-muted-foreground">
                Auth placeholder
              </div>
              <LanguageSelector />
            </div>
          </nav>
        </div>
      </div>
    </header>
  )
}

