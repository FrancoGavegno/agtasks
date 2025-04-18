# Agtasks

Agtasks es un sistema de gestión de tareas agrícolas construido con Next.js 15, React 19, TypeScript y React Query. Esta aplicación consume la API de ClickUp para gestionar listas y tareas.

## Características

- Gestión de listas y tareas consumiendo la API de ClickUp con React Query.
- Internacionalización con `next-intl`.
- UI basada en ui.shadcn/tailwind CSS.

## Tecnologías

- [Nextjs 14 App Router](https://nextjs.org/docs)
- [React 18](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [React Hook Form](https://react-hook-form.com/)
- [React Query](https://tanstack.com/query/latest/docs/framework/react/overview)
- [shadcn/ui](https://ui.shadcn.com/docs)
- [Lucide React Icons](https://lucide.dev/icons/)
- [ClickUp API](https://developer.clickup.com/)
- [Amplify Gen2](https://docs.amplify.aws/nextjs/start/quickstart/nextjs-app-router-client-components/)


## Instalación

1. Clona el repositorio:
```
git clone https://github.com/FrancoGavegno/agtasks-app.git 
cd agtasks-app
```

2. Instala las dependencias:
```
npm install
```

3. Configura las variables de entorno: 
Crea un archivo .env.local en la raíz del proyecto y añade tu clave de API de ClickUp.

```
// file env.local

NEXT_PUBLIC_API_URL=https://api.clickup.com/api/v2
NEXT_PUBLIC_API_KEY=clickup-api-key
NEXT_PUBLIC_TEAM_ID=clickup-team-id
NEXT_PUBLIC_FMS_API_URL=360-api-url
NEXT_PUBLIC_FMS_API_KEY=360-api-key
NEXT_PUBLIC_FMS_WK_ID=360-workspace-id

```

4. Inicia el servidor de desarrollo: 
```
npm run dev
```

5. Esta App corre por defecto en http://localhost:3000.