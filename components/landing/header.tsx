import { Button } from "@/components/ui/button"
import Image from "next/image"

export default function Header() {
  return (
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
  )
}
