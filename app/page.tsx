// import { useTranslations } from 'next-intl'
import Image from "next/image"
import { Check } from "lucide-react"

export default function AppPage() {
  //const t = useTranslations("LandingPage")

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
      <header className="py-20 px-6 md:px-12 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">Gestión agro simple y eficiente</h1>
          <p className="text-lg md:text-xl mb-8 text-gray-600 max-w-lg">
            Agtasks te permite administrar servicios y tareas agrícolas con facilidad. 
          </p>
          {/* <Button size="lg" className="px-8 py-6 text-lg">
            Comenzar ahora
          </Button> */}
        </div>
        <div className="relative w-full h-auto aspect-[4/3] rounded-lg overflow-hidden">
          <Image
            src="/header.png"
            alt="Agtasks - Gestión agro simple y eficiente"
            fill
            className="object-contain"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
          />
        </div>
      </div>
    </header>

      {/* Beneficios clave - Fila debajo del header */}
      <section className="py-4 px-6 md:px-12">
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

    </div>
  )
}
