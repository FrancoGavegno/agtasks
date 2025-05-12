import Link from "next/link"

import { Button } from "@/components/ui/button"
import { HomeIcon } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col items-center justify-center space-y-8 text-center">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
          Esta página estará lista proximamente...
        </h1>
        <p className="mx-auto max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
          Estamos trabajando para tenerla lista lo antes posible. Mientras tanto, puedes volver al inicio.
        </p>
      </div>
      <Button asChild>
        <Link href="/" className="gap-2">
          <HomeIcon className="h-4 w-4" />
          Volver al inicio
        </Link>
      </Button>
    </div>
  )
}
