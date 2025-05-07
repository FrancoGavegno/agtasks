import Link from "next/link"
import { useTranslations } from "next-intl"

export function Footer() {
  const t = useTranslations("Footer")

  return (
    <footer className="w-full border-t bg-background">
      <div className="container flex h-14 items-center justify-center text-sm mx-auto">
        <span className="text-muted-foreground">
          {t("poweredBy")}{" "}
          <Link 
            href="https://geoagro.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="font-medium underline underline-offset-4 hover:text-primary"
          >
            GeoAgro
          </Link>
        </span>
      </div>
    </footer>
  )
}

