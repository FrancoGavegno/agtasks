"use client"
import { useTranslations } from 'next-intl'

export default function DashboardPage() {
  const t = useTranslations("DashboardPage")

  const configSteps = [
    {
      title: t("steps-1"),
    },
    {
      title: t("steps-2"),
    },
    {
      title: t("steps-3"),
    },
  ]

  const serviceSteps = [
    {
      title: t("steps-4"),
    },
  ]


  return (
    <div className="min-h-screen bg-white">
     
       {/* Simple Steps Section */}
       <section className="py-10 px-6 md:px-12">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center text-gray-900">{t("title")}</h2>
          <p className="text-lg text-gray-600 mb-16 text-center max-w-2xl mx-auto">
          {t("subtitle")}
          </p>

          <div className="space-y-16">
            {/* Configuración Inicial */}
            <div>
              <h3 className="text-2xl font-bold mb-8 text-gray-900">{t("steps-title-1")}</h3>
              <div className="relative">
                {/* Línea vertical */}
                <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-gray-200"></div>

                <div className="space-y-12">
                  {configSteps.map((step, index) => (
                    <div key={index} className="relative flex">
                      <div className="flex-shrink-0 z-10 w-10 h-10 rounded-full bg-primary text-white font-bold flex items-center justify-center mr-6">
                        {index + 1}
                      </div>
                      <p className="text-gray-800 pt-1.5">{step.title}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Creación de Servicios */}
            <div>
              <h3 className="text-2xl font-bold mb-8 text-gray-900">{t("steps-title-2")}</h3>
              <div className="relative">
                {/* Línea vertical */}
                <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-gray-200"></div>

                <div className="space-y-12">
                  {serviceSteps.map((step, index) => (
                    <div key={index} className="relative flex">
                      <div className="flex-shrink-0 z-10 w-10 h-10 rounded-full bg-primary text-white font-bold flex items-center justify-center mr-6">
                        {index + 1}
                      </div>
                      <p className="text-gray-800 pt-1.5">{step.title}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Resources Section 
      <section className="py-20 px-6 md:px-12">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-12 text-gray-900">{t("help-title")}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 border border-gray-200 rounded-lg">
               <h3 className="text-xl font-semibold mb-3 text-gray-900">Guía rápida</h3>
              <p className="text-gray-600">Aprende los conceptos básicos para comenzar a usar Agtasks.</p>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">{t("help-subtitle-1")}</h3>
              <p className="text-gray-600">{t("help-text-1")}</p>
            </div>
            <div className="p-6 border border-gray-200 rounded-lg">
              <h3 className="text-xl font-semibold mb-3 text-gray-900">{t("help-subtitle-2")}</h3>
              <p className="text-gray-600">{t("help-text-2")}</p>
            </div>
            <div className="p-6 border border-gray-200 rounded-lg">
              <h3 className="text-xl font-semibold mb-3 text-gray-900">{t("help-subtitle-3")}</h3>
              <p className="text-gray-600">{t("help-text-3")}</p>
            </div>
          </div>
        </div>
      </section> */}

    </div>
  )
}
