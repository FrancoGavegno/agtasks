"use client"

import { useState } from "react"
import Header from "@/components/landing/header"
import { Check } from "lucide-react"
import { Link } from "@/i18n/routing"

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState(0)

  const tabs = ["Seleeciona Protocolos", "Gestiona Usuarios y Roles", "Añade Formularios", "Crea tu primer Servicio"]

  const tabContent = [
    {
      title: "Selecciona Protocolos",
      description:
        "Los protocolos se usan para estandarizar tareas frecuentes en tus servicios agropecuarios. Elige cuales estarán disponibles para tus usuarios y agiliza así la creación de servicios.",
    },
    {
      title: "Gestiona Usuarios y Roles",
      description:
        "Invita a tu equipo a usar Agtasks y define claramente quién hace qué. Crea roles específicos y asigna usuarios que podrán encargarse de las tareas dentro de cada servicio.",
    },
    {
      title: "Añade Formularios",
      description:
        "Selecciona o crea formularios para capturar datos precisos directamente desde el campo. Vincúlalos fácilmente con las tareas específicas que elijas dentro de tus servicios.",
    },
    {
      title: "Crea tu primer Servicio",
      description:
        "Crea servicios en minutos usando protocolos predefinidos, asignando roles, usuarios y formularios a tareas. Optimiza tu tiempo y comienza rápidamente con la gestión eficiente de tus servicios agropecuarios.",
    },
  ]

  const benefits = [
    {
      title: "Control claro",
      description: "Sigue el avance en tiempo real.",
    },
    {
      title: "Mejores decisiones",
      description: "Información precisa en cada tarea.",
    },
    {
      title: "Menos errores",
      description: "Protocolos estandarizados y claros.",
    },
  ]

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Beneficios clave - Fila debajo del header */}
      <section className="py-8 px-6 md:px-12 border-b">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-start">
                <div className="mr-4 mt-1 bg-primary/10 rounded-full p-1">
                  <Check className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{benefit.title}</h3>
                  <p className="text-gray-600">{benefit.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Simple Steps Section */}
      <section className="py-20 px-6 md:px-12 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">Guía rápida para usar Agtasks</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {tabContent.map((content, index) => (
              <div key={index} className="bg-white p-8 rounded-lg shadow-sm text-left">
                <div className="flex items-center mb-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary text-white font-bold flex items-center justify-center mr-3">
                    {index + 1}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">{content.title}</h3>
                </div>
                <p className="text-gray-600 mt-2">{content.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Resources Section */}
      <section className="py-20 px-6 md:px-12">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-12 text-gray-900">Recursos de Ayuda y Soporte</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 border border-gray-200 rounded-lg">
              {/* <h3 className="text-xl font-semibold mb-3 text-gray-900">Guía rápida</h3>
              <p className="text-gray-600">Aprende los conceptos básicos para comenzar a usar Agtasks.</p>*/}
              <h3 className="text-xl font-semibold mb-3 text-gray-900">Próximo paso</h3>
              <p className="text-gray-600">Realiza una <Link href="/domains/8644/settings">Configuración inicial</Link> antes de crear tu primer servicio. </p>
            </div>
            <div className="p-6 border border-gray-200 rounded-lg">
              <h3 className="text-xl font-semibold mb-3 text-gray-900">Tutoriales</h3>
              <p className="text-gray-600">(Proximamente) Tutoriales paso a paso para dominar Agtasks.</p>
            </div>
            <div className="p-6 border border-gray-200 rounded-lg">
              <h3 className="text-xl font-semibold mb-3 text-gray-900">Soporte</h3>
              <p className="text-gray-600">Obtén ayuda en tiempo real de nuestro equipo de soporte.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
