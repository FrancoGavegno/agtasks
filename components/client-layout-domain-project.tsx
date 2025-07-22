 "use client";

import { useState, useEffect } from "react";
import { Navbar } from "@/components/navbar/navbar";
import { AppSidebar } from "@/components/sidebar";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { listDomainsByUserEmail } from "@/lib/integrations/360";
import { listProjectsByDomain } from "@/lib/services/agtasks";
import { Domain } from "@/lib/interfaces/360";
import { Project } from "@/lib/interfaces/agtasks";
import { useParams } from "next/navigation";

export default function ClientLayoutWithDomainProject({ userEmail, children }: { userEmail: string, children: React.ReactNode }) {
  const [domains, setDomains] = useState<Domain[]>([]);
  const [selectedDomain, setSelectedDomain] = useState<Domain>();
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project>();
  const params = useParams();

  // Extraer IDs de la URL si existen
  const domainIdFromUrl = params?.domain;
  const projectIdFromUrl = params?.project;

  useEffect(() => {
    const fetchDomains = async () => {
      const domainsData = await listDomainsByUserEmail(userEmail);
      setDomains(domainsData);
      // Si hay domainId en la URL, seleccionarlo
      if (domainIdFromUrl) {
        const found = domainsData.find(d => d.id.toString() === domainIdFromUrl.toString());
        if (found) {
          setSelectedDomain(found);
          return;
        }
      }
      if (!selectedDomain && domainsData.length > 0) setSelectedDomain(domainsData[0]);
    };
    fetchDomains();
  }, [userEmail, domainIdFromUrl]);

  useEffect(() => {
    const fetchProjects = async () => {
      if (selectedDomain) {
        const result = await listProjectsByDomain(selectedDomain.id.toString());
        const projectsData: Project[] = Array.isArray(result)
          ? result.map((p: any) => ({
              ...p,
              tmpSourceSystem: p.tmpSourceSystem ?? "", 
            }))
          : [];
        setProjects(projectsData);
        // Si hay projectId en la URL, seleccionarlo
        if (projectIdFromUrl) {
          const found = projectsData.find((p: Project) => p.id?.toString() === projectIdFromUrl.toString());
          if (found) {
            setSelectedProject(found);
            return;
          }
        }
        if (projectsData.length > 0) setSelectedProject(projectsData[0]);
      } else {
        setProjects([]);
        setSelectedProject(undefined);
      }
    };
    fetchProjects();
  }, [selectedDomain, projectIdFromUrl]);

  return (
    <>
      <Navbar
        domains={domains}
        projects={projects}
        selectedDomain={selectedDomain}
        selectedProject={selectedProject}
        setSelectedDomain={(domain) => {
          setSelectedDomain(domain);
          setSelectedProject(undefined); // Limpiar proyecto al cambiar dominio
        }}
        setSelectedProject={setSelectedProject}
      />
      <div className="flex flex-1 overflow-hidden">
        <SidebarProvider>
          <AppSidebar
            user={userEmail}
            domains={domains}
            projects={projects}
            selectedDomain={selectedDomain}
            selectedProject={selectedProject}
          />
          <SidebarInset>
            <main className="min-h-screen px-5">{children}</main>
          </SidebarInset>
        </SidebarProvider>
      </div>
    </>
  );
}
