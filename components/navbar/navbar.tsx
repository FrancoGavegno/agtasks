"use client"

import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs"
import { Link } from '@/i18n/routing'
import { useTranslations } from 'next-intl'
import { LanguageSelector } from "@/components/language-selector"
import DomainProjectSelector from "@/components/navbar/domain-selector"
import { Domain } from "@/lib/interfaces/360"
import { Project } from "@/lib/interfaces/agtasks"

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
    // Aquí puedes abrir un modal o redirigir a la página de creación de proyecto
    alert('Crear Proyecto')
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center mx-auto">
        <Link href="/" className="font-bold mr-auto">
          Agtasks
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
              <SignedOut>
                <SignInButton />
                <SignUpButton />
              </SignedOut>
              <SignedIn>
                <LanguageSelector />
                <UserButton />
              </SignedIn>
            </div>
          </nav>
        </div>
      </div>
    </header>
  )
}

