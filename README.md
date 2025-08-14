# Agtasks

# Visión general

## Introducción
Este manual le guiará a través de todas las funcionalidades disponibles para optimizar sus operaciones agrícolas con **Agtasks**.

## Acerca del Sistema
**Agtasks** es una plataforma web que centraliza la gestión de servicios y tareas agrícolas, integrando sistemas externos como Jira y 360° para proporcionar una experiencia completa y eficiente.

## Versión Actual
**Versión 3.0** – Última actualización disponible

---

## Características Principales

### Gestión de Servicios
- **Lista de Servicios:** Visualización y gestión de todos los servicios del proyecto.
- **Crear Servicio:** Formulario de 3 pasos simplificado:
  1. Selección de protocolo de servicio.
  2. Selección de lotes (opcional, por defecto todos).
  3. Asignación de tareas y usuarios.

### Gestión de Tareas
- **Lista de Tareas:** Visualización y gestión de todas las tareas del proyecto.
- **Crear Tarea:** Formulario de 3 pasos:
  1. Datos de la tarea (nombre, tipo, formulario dinámico).
  2. Selección de lotes (opcional, por defecto todos).
  3. Asignación de usuario.
- **Editar Tarea:** Modificación de campos dinámicos y lotes asociados.

### Análisis de Lotes
- **Vista de Lotes:** Herramienta de análisis por establecimiento.
- **Búsqueda por filtros:** Espacio de trabajo → Campaña → Establecimiento.
- **Estadísticas:** Servicios y tareas asociadas al establecimiento.
- **Tabla de tareas:** Visualización detallada con enlaces a Jira y edición.

### Integración API
- **API completa:** Todos los métodos CRUD disponibles.
- **Integración 360°:** Conexión directa con datos de lotes y usuarios.
- **Integración Jira:** Creación automática de tickets y subtareas.

---

## Requisitos del Sistema
- Credenciales de acceso al sistema.
- Permisos de usuario asignados por el administrador.
- Acceso a sistemas integrados (360°, Jira).

---

## Soporte Técnico
Para consultas técnicas o reportar problemas:
- Consulte la documentación disponible (este manual).
- Contacte al equipo de soporte interno: [help.geoagro.com](https://help.geoagro.com).
- Contacte a `fgavegno@geoagro.com`.

**URL:**  
[https://main.d3bqomgmo6ktid.amplifyapp.com/es/](https://main.d3bqomgmo6ktid.amplifyapp.com/es/)  
Se loguea con el email de `@geoagro.com` que uses.

---

## Proyectos

### Crear un proyecto
> Actualmente se realiza de forma manual por el desarrollador de Agtasks.  
Para información técnica detallada, consulte a `fgavegno@geoagro.com`.

---

### Crear un template de Protocolo
Acceso al proyecto **"PROTOCOLOS"**:

1. Ingresar al portal de Jira Service Management.
2. Seleccionar el proyecto **"PROTOCOLOS"**.
3. Hacer clic en **"Submit a request or incident"**.
4. El sistema muestra el formulario de creación de protocolo.

#### Paso 1: Información Básica del Protocolo
1. **Summary** (obligatorio): Nombre breve del protocolo.
2. **Description** (obligatorio): Detalles del protocolo.
3. **Label** (obligatorio): `"EN"` (Inglés) | `"ES"` (Español) | `"PT"` (Portugués).

#### Paso 2: Crear Subtareas
1. Clic en **"Create subtask"** en el menú del request.
2. Completar:
   - **Summary:** Nombre de la subtarea.
   - **Description:** Detalles específicos.
3. Repetir para cada subtarea requerida.

#### Paso 3: Configurar Subtareas
1. Completar **Task Type** (obligatorio): `"administrative"`, `"tillage"`, `"fieldvisit"`.
2. Guardar cambios.  
> *(Nota: Esta configuración se aplica individualmente a cada subtarea)*

---

### Conectar una cuenta de Kobo Toolbox
> Actualmente se realiza de forma manual por el desarrollador de Agtasks.  
Para información técnica detallada, consulte a `fgavegno@geoagro.com`.

---

## Servicios

### Crear un Servicio

#### Acceso al Formulario
1. Navegar a la lista de servicios del proyecto.
2. Clic en **"Crear Servicio"**.
3. Se muestra un formulario de 3 pasos.

#### Paso 1: Selección de Protocolo de Servicio
**Qué hacer:**
- Seleccionar un protocolo de servicio del dropdown.
- El sistema carga automáticamente las tareas asociadas.

**Qué se muestra:**
- Lista de protocolos disponibles.
- Tareas que incluye el protocolo seleccionado.
- Estado de carga mientras se buscan tareas.

**Validación:**
- Debe seleccionar un protocolo para continuar.

#### Paso 2: Selección de Lotes
**Qué hacer:**
1. Seleccionar **Espacio de Trabajo** (obligatorio).
2. Seleccionar **Campaña** (obligatorio).
3. Seleccionar **Establecimiento** (obligatorio).
4. Seleccionar **Lotes** (opcional, por defecto todos).

**Validación:**
- Espacio, campaña y establecimiento obligatorios.
- Lotes opcionales.

#### Paso 3: Asignación de Tareas
**Qué hacer:**
1. Habilitar/Deshabilitar tareas.
2. Asignar usuario (obligatorio).
3. Seleccionar formulario (solo para tareas tipo `fieldvisit`).

**Validación:**
- Usuario obligatorio en tareas habilitadas.
- Formulario obligatorio en `fieldvisit`.

---

**Creación del Servicio:**
1. Validación final.
2. Creación de ticket en Jira.
3. Registro en base de datos.
4. Creación de subtareas.
5. Asociación de lotes.
6. Redirección a la lista de servicios.

---

## Tareas

### Crear una Tarea

#### Paso 1: Datos de la Tarea
- Nombre (obligatorio).
- Tipo de tarea (obligatorio).
- Formulario (obligatorio para `fieldvisit`).
- Campos dinámicos (si aplica).

#### Paso 2: Selección de Lotes
- Mismo flujo que en servicios.

#### Paso 3: Asignación de Usuario
- Usuario obligatorio.

**Creación de la tarea:**
- Registro en base de datos.
- Ticket en Jira.
- Asociación de lotes.
- Redirección a lista.

---

### Editar una Tarea

**Campos de solo lectura:**
- Nombre.
- Tipo.
- Formulario.
- Usuario asignado.

**Campos editables:**
- Campos dinámicos.
- Lotes (agregar/eliminar).

**Flujo:**
1. Carga de datos actuales.
2. Modificación de campos permitidos.
3. Validación.
4. Actualización en base de datos.
5. Limpieza de datos temporales.
6. Redirección.

---

## Notas Importantes
- **Datos persistentes:** Los datos se mantienen entre pasos.
- **Validación en tiempo real:** Errores visibles inmediatamente.
- **Carga progresiva:** Datos cargados según selección.
- **Integración Jira:** Tickets automáticos.
- **Selección de lotes:** Por defecto todos los lotes.
- **Formularios dinámicos:** Campos según tipo de tarea.
- **Usuario fijo:** No se cambia en edición.

## Tecnologías

- [Nextjs 14 App Router](https://nextjs.org/docs)
- [React 18](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [React Hook Form](https://react-hook-form.com/)
- [React Query](https://tanstack.com/query/latest/docs/framework/react/overview)
- [shadcn/ui](https://ui.shadcn.com/docs)
- [Lucide React Icons](https://lucide.dev/icons/)
- [Amplify Gen2](https://docs.amplify.aws/nextjs/start/quickstart/nextjs-app-router-client-components/)


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

# AWS Configuration
NEXT_PUBLIC_BASEURLAUTH=https://testing-auth.geoagro.com/

NEXT_PUBLIC_JIRA_API_URL=https://geoagro1.atlassian.net
NEXT_PUBLIC_JIRA_API_TOKEN=Zmdh****************
NEXT_PUBLIC_JIRA_PROTOCOLS_PROJECT_ID=TEM
NEXT_PUBLIC_JIRA_PROTOCOLS_QUEUE_ID=82

NEXT_PUBLIC_FMS_WK_ID=5203
NEXT_PUBLIC_FMS_API_URL=https://******.appsync-api.us-east-1.amazonaws.com/graphql
NEXT_PUBLIC_FMS_API_KEY=da2-yawqn**************

NEXT_PUBLIC_SITE_URL=http://localhost:3000

```

4. Inicia el servidor de desarrollo: 
```
npm run dev
```

5. Esta App corre por defecto en http://localhost:3000.