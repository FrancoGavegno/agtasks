import { 
    Sprout, 
    SproutIcon as Seedling, 
    Shield, 
    Droplets, 
    Eye, 
    ShowerHeadIcon as Shower, 
    Wheat, 
    Wrench, 
    Recycle, 
    BarChart3, 
    Map,
    MapPin, 
    Bug, 
    Layers,
    Package 
} from 'lucide-react'

export const formTypes = [
    {
        "title": "Planificación de cultivos",
        "description": "Utiliza la capa de Lotes para asignar cultivos a cada campo.",
        "input": ["farm", "field", "layer#field"],
        "icon": Sprout
    },
    {
        "title": "Siembra",
        "description": "Utiliza la capa de Prescripciones para realizar la siembra según el mapa de siembra.",
        "input": ["farm", "field", "layer#prescription"],
        "icon": Seedling
    },
    {
        "title": "Protección del cultivo",
        "description": "Utiliza la capa de Recorridas para aplicar herbicidas y pesticidas de manera precisa.",
        "input": ["farm", "field", "layer#field_visit"],
        "icon": Shield
    },
    {
        "title": "Fertilización",
        "description": "Utiliza la capa de Prescripciones para aplicar fertilizantes de manera precisa.",
        "input": ["farm", "field", "layer#prescription"],
        "icon": Droplets
    },
    {
        "title": "Monitoreo",
        "description": "Utiliza la capa de Recorridas para realizar un seguimiento constante de los cultivos.",
        "input": ["farm", "field", "layer#field_visit"],
        "icon": Eye  
    },
    {
        "title": "Riego",
        "description": "Utiliza la capa de Recorridas para asegurar que los cultivos reciban la cantidad adecuada de agua.",
        "input": ["farm", "field", "layer#field_visit"],
        "icon": Shower
    },
    {
        "title": "Cosecha",
        "description": "Utiliza la capa de Lotes para planificar y ejecutar la cosecha en el momento óptimo.",
        "input": ["farm", "field", "layer#field"],
        "icon": Wheat
    },
    {
        "title": "Mantenimiento de maquinaria",
        "description": "No se requiere una capa específica para esta tarea, pero puedes utilizar la capa de Lotes para organizar el mantenimiento por campo.",
        "input": ["farm", "field", "layer#field"],
        "icon": Wrench
    },
    {
        "title": "Gestión de residuos",
        "description": "Utiliza la capa de Lotes para manejar adecuadamente los residuos agrícolas.",
        "input": ["farm", "field", "layer#field"],
        "icon": Recycle
    },
    {
        "title": "Análisis de datos",
        "description": "Utiliza las capas de Lotes, Recorridas y Prescripciones para analizar los datos de los cultivos y tomar decisiones informadas.",
        "input": ["farm", "field", "layer"],
        "icon": BarChart3
    },
    {
        "title": "Recorrida a campo",
        "description": "Utiliza la capa de Recorridas para registrar datos en tiempo real durante las visitas a campo.",
        "input": ["farm", "field", "layer#field_visit"],
        "icon": MapPin
    },
    {
        "title": "Mapeo de rendimiento",
        "description": "Utiliza la capa de Lotes para mapear el rendimiento de cada campo y optimizar futuras plantaciones.",
        "input": ["farm", "field", "layer#field"],
        "icon": Map
    },
    {
        "title": "Control de plagas",
        "description": "Utiliza la capa de Recorridas para identificar y gestionar plagas en tiempo real.",
        "input": ["farm", "field", "layer#field_visit"],
        "icon": Bug
    },
    {
        "title": "Análisis de suelos",
        "description": "Utiliza la capa de Lotes para analizar la composición del suelo y planificar mejoras.",
        "input": ["farm", "field", "layer#field"],
        "icon": Layers
    },
    {
        "title": "Gestión de insumos",
        "description": "Usa la capa de Prescripciones para gestionar y planificar la utilización de insumos agrícolas.",
        "input": ["farm", "field", "layer#prescription"],
        "icon": Package
    }
]

export const taskTypes = [
    {
        "taskId": "task01",
        "taskName": "Crear y Actualizar la Capa de Lotes",
        "description": "Asegúrate de que todos los campos estén correctamente definidos y actualizados en la capa de Lotes. Incluye la delimitación precisa de cada parcela dentro de la granja.",
        "documentation": "https://support.geoagro.com/es/kb/articles/lotes"
    },
    {
        "taskId": "task02",
        "taskName": "Asignar Cultivos a Lotes",
        "description": "Usa la capa de Lotes para asignar específicamente qué cultivo se sembrará en cada campo, esencial para la rotación y optimización de rendimientos.",
        "documentation": "https://support.geoagro.com/es/kb/articles/planificacion-de-cultivos"
    },
    {
        "taskId": "task03",
        "taskName": "Analizar Suelos por Lote",
        "description": "Realiza un análisis de suelos para cada lote asignado para cultivo para ajustar la planificación según las necesidades específicas de nutrientes y condiciones del terreno.",
        "documentation": "https://support.geoagro.com/es/kb/articles/analisis-de-suelos"
    },
    {
        "taskId": "task04",
        "taskName": "Planificar el Calendario de Siembra",
        "description": "Establece un calendario de siembra para cada cultivo en cada lote, considerando factores climáticos, tipos de suelo y ciclos de cultivo para maximizar la productividad.",
        "documentation": "https://support.geoagro.com/es/kb/articles/calendario-agricola"
    },
    {
        "taskId": "task05",
        "taskName": "Revisar y Ajustar la Planificación",
        "description": "Revisa y ajusta la planificación inicial basada en datos históricos, condiciones actuales y posibles cambios en las condiciones de mercado para asegurar la sostenibilidad de la producción.",
        "documentation": "https://support.geoagro.com/es/kb/articles/ajustes-en-la-planificacion"
    },
    {
        "taskId": "task06",
        "taskName": "Crear Prescripciones de Siembra",
        "description": "Desarrolla mapas de prescripción detallados para la siembra, ajustando la densidad y tipo de semillas según las características del suelo y del cultivo.",
        "documentation": "https://support.geoagro.com/es/kb/articles/prescripciones"
    },
    {
        "taskId": "task07",
        "taskName": "Aplicar Pesticidas",
        "description": "Planifica y registra la aplicación de pesticidas, asegurando que se haga en el momento adecuado y en las áreas correctas para minimizar daños a los cultivos.",
        "documentation": "https://support.geoagro.com/es/kb/articles/aplicacion-de-pesticidas"
    },
    {
        "taskId": "task08",
        "taskName": "Monitorear Plagas",
        "description": "Realiza monitoreos periódicos para detectar la presencia de plagas y evaluar la eficacia de los tratamientos aplicados.",
        "documentation": "https://support.geoagro.com/es/kb/articles/monitoreo-de-plagas"
    },
    {
        "taskId": "task09",
        "taskName": "Actualizar Información Climática",
        "description": "Mantén actualizada la información climática para ajustar estrategias de riego, protección y siembra.",
        "documentation": "https://support.geoagro.com/es/kb/articles/informacion-climatica"
    },
    {
        "taskId": "task10",
        "taskName": "Registrar Recorridas a Campo",
        "description": "Documenta observaciones, problemas y acciones tomadas durante las recorridas de campo para tener un registro histórico.",
        "documentation": "https://support.geoagro.com/es/kb/articles/recorridas"
    },
    {
        "taskId": "task11",
        "taskName": "Analizar Rendimiento",
        "description": "Realiza un análisis post-cosecha para evaluar el rendimiento de cada lote y comparar con expectativas y datos históricos.",
        "documentation": "https://support.geoagro.com/es/kb/articles/analisis-de-rendimiento"
    },
    {
        "taskId": "task12",
        "taskName": "Gestionar Fertilizantes",
        "description": "Planifica la aplicación de fertilizantes basada en análisis de suelos y las necesidades de cada cultivo para optimizar el uso.",
        "documentation": "https://support.geoagro.com/es/kb/articles/gestion-de-fertilizantes"
    },
    {
        "taskId": "task13",
        "taskName": "Mantener Infraestructura de Riego",
        "description": "Revisa y mantiene el sistema de riego para asegurar su correcto funcionamiento durante la temporada de cultivo.",
        "documentation": "https://support.geoagro.com/es/kb/articles/mantenimiento-de-riego"
    },
    {
        "taskId": "task14",
        "taskName": "Evaluar Calidad de Suelo Post-Cosecha",
        "description": "Posterior a la cosecha, realiza un análisis de suelos para evaluar el estado y planificar mejoras o rotaciones.",
        "documentation": "https://support.geoagro.com/es/kb/articles/evaluacion-de-suelos"
    },
    {
        "taskId": "task15",
        "taskName": "Planificar Gestión de Residuos",
        "description": "Desarrolla un plan para el manejo de residuos post-cosecha, incluyendo compostaje, reciclaje o eliminación.",
        "documentation": "https://support.geoagro.com/es/kb/articles/gestion-de-residuos"
    },
    {
        "taskId": "task16",
        "taskName": "Optimizar Uso de Maquinaria",
        "description": "Asegura que la maquinaria esté operando de manera eficiente, asignando tareas y mantenimiento preventivo a lo largo de la temporada.",
        "documentation": "https://support.geoagro.com/es/kb/articles/mantenimiento-de-maquinaria"
    },
    {
        "taskId": "task17",
        "taskName": "Analizar Datos de Sensores",
        "description": "Recolecta y analiza datos de sensores de campo para ajustes en tiempo real de la gestión de cultivos.",
        "documentation": "https://support.geoagro.com/es/kb/articles/sensores-de-campo"
    },
    {
        "taskId": "task18",
        "taskName": "Capacitar al Personal",
        "description": "Organiza capacitaciones para el personal sobre nuevas tecnologías, prácticas agrícolas y gestión de datos.",
        "documentation": "https://support.geoagro.com/es/kb/articles/capacitacion"
    },
    {
        "taskId": "task19",
        "taskName": "Implementar Nuevas Tecnologías",
        "description": "Evalúa e integra nuevas tecnologías para la agricultura de precisión, como drones o sistemas de información geográfica.",
        "documentation": "https://support.geoagro.com/es/kb/articles/tecnologias-agricolas"
    },
    {
        "taskId": "task20",
        "taskName": "Revisar Presupuestos y Costos",
        "description": "Monitorea y ajusta el presupuesto agrícola según los gastos reales y las fluctuaciones en el mercado.",
        "documentation": "https://support.geoagro.com/es/kb/articles/gestion-financiera"
    },
    {
        "taskId": "task21",
        "taskName": "Importar recorridas desde KoboToolbox",
        "description": "Para poder visualizar en 360 la información recolectada a campo con formularios de KoboToolBox es necesario que el usuario Administrador la importe utilizando Datasync. ",
        "documentation": "https://support.geoagro.com/es/kb/como-integrar-kobotoolbox-en-geoagro-360-mediante-datasync/"
    }
]

export const fieldTypes = [
    {
        "name": "loteId",
        "label": "Identificador del Lote",
        "type": "text",
        "required": true
    },
    {
        "name": "loteName",
        "label": "Nombre del Lote",
        "type": "text",
        "required": true
    },
    {
        "name": "loteArea",
        "label": "Área del Lote (ha)",
        "type": "number",
        "required": true
    },
    {
        "name": "fieldCoordinates",
        "label": "Coordenadas del Lote",
        "type": "textarea",
        "required": true,
        "placeholder": "Ejemplo: Latitud, Longitud; Latitud, Longitud"
    },
    {
        "name": "pointCoordinates",
        "label": "Coordenadas del Punto",
        "type": "textarea",
        "required": true,
        "placeholder": "Ejemplo: Latitud, Longitud; Latitud, Longitud"
    },
    {
        "name": "updateDate",
        "label": "Fecha de Última Actualización",
        "type": "date",
        "required": true
    },
    {
        "name": "cultivo",
        "label": "Cultivo a Asignar",
        "type": "select",
        "options": ["Maíz", "Trigo", "Soja", "Cebada", "Girazol", "Otro"],
        "required": true
    },
    {
        "name": "variedad",
        "label": "Variedad del Cultivo",
        "type": "text",
        "required": false
    },
    {
        "name": "fechaSiembra",
        "label": "Fecha de Siembra Planificada",
        "type": "date",
        "required": true
    },
    {
        "name": "fechaCosecha",
        "label": "Fecha Estimada de Cosecha",
        "type": "date",
        "required": true
    },
    {
        "name": "ph",
        "label": "pH del Suelo",
        "type": "number",
        "step": "0.1",
        "required": true
    },
    {
        "name": "materiaOrganica",
        "label": "% de Materia Orgánica",
        "type": "number",
        "step": "0.1",
        "required": true
    },
    {
        "name": "nutrientes",
        "label": "Niveles de Nutrientes (N, P, K)",
        "type": "textarea",
        "required": true,
        "placeholder": "Ejemplo: N: 50, P: 30, K: 40"
    },
    {
        "name": "cambios",
        "label": "Descripción de Cambios",
        "type": "textarea",
        "required": false,
        "placeholder": "Describa los ajustes realizados"
    },
    {
        "name": "motivo",
        "label": "Motivo del Ajuste",
        "type": "text",
        "required": false
    },
    {
        "name": "fechaAjuste",
        "label": "Fecha del Ajuste",
        "type": "date",
        "required": false
    },
    {
        "name": "farmName",
        "label": "Nombre de la Granja",
        "type": "text",
        "required": true
    },
    {
        "name": "fieldId",
        "label": "Identificador del Campo",
        "type": "text",
        "required": true
    },
    {
        "name": "fieldName",
        "label": "Nombre del Campo",
        "type": "text",
        "required": true
    },
    {
        "name": "fieldArea",
        "label": "Área del Campo (ha)",
        "type": "number",
        "required": true
    },
    {
        "name": "cropType",
        "label": "Tipo de Cultivo",
        "type": "select",
        "options": ["Maíz", "Trigo", "Soja", "Cebada", "Girazol", "Otro"],
        "required": true
    },
    {
        "name": "cropVariety",
        "label": "Variedad del Cultivo",
        "type": "text",
        "required": false
    },
    {
        "name": "plantingDate",
        "label": "Fecha de Siembra",
        "type": "date",
        "required": true
    },
    {
        "name": "harvestDate",
        "label": "Fecha de Cosecha",
        "type": "date",
        "required": true
    },
    {
        "name": "soilPh",
        "label": "pH del Suelo",
        "type": "number",
        "step": "0.1",
        "required": true
    },
    {
        "name": "soilOrganicMatter",
        "label": "% de Materia Orgánica",
        "type": "number",
        "step": "0.1",
        "required": true
    },
    {
        "name": "nutrientLevels",
        "label": "Niveles de Nutrientes (N, P, K)",
        "type": "textarea",
        "required": true,
        "placeholder": "Ejemplo: N: 50, P: 30, K: 40"
    },
    {
        "name": "pesticideApplied",
        "label": "Pesticida Aplicado",
        "type": "text",
        "required": false
    },
    {
        "name": "pesticideApplicationDate",
        "label": "Fecha de Aplicación de Pesticida",
        "type": "date",
        "required": false
    },
    {
        "name": "fertilizerType",
        "label": "Tipo de Fertilizante",
        "type": "text",
        "required": false
    },
    {
        "name": "fertilizerApplicationDate",
        "label": "Fecha de Aplicación de Fertilizante",
        "type": "date",
        "required": false
    },
    {
        "name": "fertilizerAmount",
        "label": "Cantidad de Fertilizante (kg/ha)",
        "type": "number",
        "required": false
    },
    {
        "name": "waterAmount",
        "label": "Cantidad de Agua Aplicada (litros/ha)",
        "type": "number",
        "required": false
    },
    {
        "name": "irrigationDate",
        "label": "Fecha de Riego",
        "type": "date",
        "required": false
    },
    {
        "name": "yieldEstimate",
        "label": "Estimación de Rendimiento (ton/ha)",
        "type": "number",
        "required": false
    },
    {
        "name": "actualYield",
        "label": "Rendimiento Real (ton/ha)",
        "type": "number",
        "required": false
    },
    {
        "name": "observations",
        "label": "Observaciones",
        "type": "textarea",
        "required": false,
        "placeholder": "Añade cualquier observación relevante"
    },
    {
        "name": "machineType",
        "label": "Tipo de Maquinaria",
        "type": "text",
        "required": false
    },
    {
        "name": "machineMaintenance",
        "label": "Mantenimiento de Maquinaria",
        "type": "text",
        "required": false
    },
    {
        "name": "maintenanceDate",
        "label": "Fecha de Mantenimiento",
        "type": "date",
        "required": false
    },
    {
        "name": "wasteManagement",
        "label": "Manejo de Residuos",
        "type": "textarea",
        "required": false,
        "placeholder": "Describe el manejo de residuos"
    },
    {
        "name": "dataAnalysis",
        "label": "Análisis de Datos",
        "type": "textarea",
        "required": false,
        "placeholder": "Añade análisis o conclusiones"
    },
    {
        "name": "soilSamplingDate",
        "label": "Fecha de Muestreo de Suelo",
        "type": "date",
        "required": false
    },
    {
        "name": "soilMoisture",
        "label": "Humedad del Suelo (%)",
        "type": "number",
        "step": "0.1",
        "required": false
    },
    {
        "name": "weedControl",
        "label": "Control de Malezas",
        "type": "textarea",
        "required": false,
        "placeholder": "Descripción de métodos de control de malezas"
    },
    {
        "name": "pestObservations",
        "label": "Observaciones de Plagas",
        "type": "textarea",
        "required": false,
        "placeholder": "Describe plagas observadas y acciones tomadas"
    },
    {
        "name": "climateData",
        "label": "Datos Climáticos",
        "type": "textarea",
        "required": false,
        "placeholder": "Temperatura, Humedad, Precipitación"
    },
    {
        "name": "sensorData",
        "label": "Datos de Sensores",
        "type": "textarea",
        "required": false,
        "placeholder": "Valores de sensores de humedad, temperatura, etc."
    },
    {
        "name": "trainingTopic",
        "label": "Tema de Capacitación",
        "type": "text",
        "required": false
    },
    {
        "name": "technologyImplemented",
        "label": "Tecnología Implementada",
        "type": "text",
        "required": false
    },
    {
        "name": "budgetAdjustment",
        "label": "Ajuste de Presupuesto",
        "type": "text",
        "required": false
    },
    {
        "name": "mapFile",
        "label": "Mapa de fondo",
        "type": "file",
        "required": true
    },
    {
        "name": "mapUrl",
        "label": "Mapa de fondo (URL)",
        "type": "url",
        "required": true
    }

]

