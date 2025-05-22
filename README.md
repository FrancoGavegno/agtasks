# Agtasks

Agtasks es un sistema de gestión de tareas agrícolas que permite administrar servicios y tareas agrícolas con facilidad.

Esta aplicación consume diferentes APIs para gestionar servicios, tareas, usuarios, formularios de Kobo Toolbox, entre otros.

## Características

App Agtasks versión funcional básica, destinada al “Administrador”, ej. Implementador de GeoAgro y Coordinador de Servicios del Agroservicio.

Esta App permitirá:
- Seleccionar protocolos de servicio: seleccionar protocolos de servicio por lenguaje del repositorio de protocolos de GeoAgro de acuerdo a idioma. 
- Seleccionar roles de usuario: seleccionar distintos tipos de roles de usuarios (ej. operadores, supervisores, etc.).
- Seleccionar  formularios de Kobo Toolbox: seleccionar templates de formularios del Public Collection de GeoAgro.
- Administrar un proyecto: se incluirá un proyecto inicial de muestra donde se podrá aplicar y validar toda la configuración hecha.
- Crear servicios a partir de protocolos: se incluirá una sección Servicios dentro del proyecto inicial. El usuario podrá instanciar protocolos en el proyecto de prueba siguiendo un wizard sencillo.

## Tecnologías

- [Nextjs 14 App Router](https://nextjs.org/docs)
- [React 18](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [React Hook Form](https://react-hook-form.com/)
- [React Query](https://tanstack.com/query/latest/docs/framework/react/overview)
- [shadcn/ui](https://ui.shadcn.com/docs)
- [Lucide React Icons](https://lucide.dev/icons/)
- [Amplify Gen2](https://docs.amplify.aws/nextjs/start/quickstart/nextjs-app-router-client-components/)
- [Clerk](https://clerk.com/) -> de forma temporal


## Instalación

1. Clona el repositorio:
```
git clone https://github.com/FrancoGavegno/agtasks.git 
cd agtasks
```

2. Instala las dependencias:
```
npm install
```

3. Configura las variables de entorno: 
Crea un archivo .env.local en la raíz del proyecto. Solicitar a fgavegno@geoagro.com las claves de desarrollo.

```
// file env.local

CLERK_SECRET_KEY=
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
NEXT_PUBLIC_JIRA_API_URL=https://geoagro1.atlassian.net
NEXT_PUBLIC_JIRA_API_TOKEN=
NEXT_PUBLIC_JIRA_PROTOCOLS_PROJECT_ID=TEM
NEXT_PUBLIC_JIRA_PROTOCOLS_QUEUE_ID=82
NEXT_PUBLIC_FMS_API_URL=
NEXT_PUBLIC_FMS_API_KEY=

```

4. Inicia el servidor de desarrollo: 
```
npm run dev
```

5. Esta App corre por defecto en http://localhost:3000.