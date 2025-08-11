"use client"

import { Link } from '@/i18n/routing'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import { LanguageSelector } from "@/components/language-selector"
import DomainProjectSelector from "@/components/navbar/domain-selector"
import { Domain } from "@/lib/interfaces/360"
import { type Project } from "@/lib/schemas"
import { useAuth } from "@/lib/contexts/AuthContext"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { signOut } from "aws-amplify/auth"
import { LogOut, User } from "lucide-react"

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
  const { user, authStatus } = useAuth()

  const handleCreateProject = () => {
    // TO DO: Abrir un modal o redirigir 
    // a la página de creación de proyecto
    alert('Crear Proyecto')
  }

  const handleSignOut = async () => {
    try {
      await signOut()
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  const handleSignIn = () => {
    // Solo redirigir al microservicio en producción
    if (process.env.NODE_ENV === "production") {
      const currentUrl = window.location.href
      const authUrl = `${process.env.NEXT_PUBLIC_BASEURLAUTH}/login?returnUrl=${encodeURIComponent(currentUrl)}`
      window.location.href = authUrl
    } else {
      // En desarrollo, el Authenticator se maneja automáticamente
      console.log('En desarrollo, el login se maneja con el Authenticator')
    }
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
              {authStatus === 'authenticated' && user ? (
                <>
                  <LanguageSelector />
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src="" alt={user.attributes.email} />
                          <AvatarFallback>
                            <User className="h-4 w-4" />
                          </AvatarFallback>
                        </Avatar>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56" align="end" forceMount>
                      <DropdownMenuItem className="font-normal">
                        <div className="flex flex-col space-y-1">
                          <p className="text-sm font-medium leading-none">
                            {user.attributes.email}
                          </p>
                        </div>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={handleSignOut}>
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Cerrar sesión</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              ) : (
                <>
                  <Button variant="outline" onClick={handleSignIn}>
                    Iniciar sesión
                  </Button>
                  <LanguageSelector />
                </>
              )}
            </div>
          </nav>
        </div>
      </div>
    </header>
  )
}

