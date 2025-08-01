# BreadcrumbWithTranslations Component

Este componente permite crear breadcrumbs con soporte para traducciones usando `next-intl`.

## Uso Básico

```tsx
import { BreadcrumbWithTranslations } from "@/components/ui/breadcrumb-with-translations"

<BreadcrumbWithTranslations
  items={[
    {
      label: "Home",
      href: "/"
    },
    {
      label: "Settings",
      translationKey: "SettingsPage.BreadcrumbPage",
      isCurrent: true
    }
  ]}
/>
```

## Props

### `items` (Array)
Array de objetos que definen cada elemento del breadcrumb:

- `label` (string): Texto a mostrar (fallback si no hay translationKey)
- `href` (string, opcional): URL para el enlace
- `isCurrent` (boolean, opcional): Si es la página actual (no será clickeable)
- `translationKey` (string, opcional): Clave de traducción para usar con `useTranslations()`

### `className` (string, opcional)
Clases CSS adicionales. Por defecto: `"mb-4"`

## Ejemplos

### Breadcrumb Simple
```tsx
<BreadcrumbWithTranslations
  items={[
    { label: "Proyecto", href: "/project" },
    { label: "Tareas", isCurrent: true }
  ]}
/>
```

### Breadcrumb con Traducciones
```tsx
<BreadcrumbWithTranslations
  items={[
    { label: projectName, href: `/domains/${domain}/settings` },
    { 
      label: "Tasks", 
      translationKey: "TasksPage.BreadcrumbPage",
      isCurrent: true 
    }
  ]}
/>
```

### Breadcrumb Complejo (3+ niveles)
```tsx
<BreadcrumbWithTranslations
  items={[
    { label: projectName, href: `/domains/${domain}/projects/${project}/tasks` },
    { label: "Tareas", href: `/domains/${domain}/projects/${project}/tasks` },
    { label: "Crear Tarea", isCurrent: true }
  ]}
/>
```

## Notas

- El componente es un client component (`"use client"`) para poder usar `useTranslations`
- Si no se proporciona `translationKey`, se usa `label` como fallback
- Los separadores se agregan automáticamente entre elementos
- El último elemento con `isCurrent: true` se renderiza como `BreadcrumbPage` 