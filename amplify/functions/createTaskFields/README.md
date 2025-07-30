# Create Task Fields Lambda Function

Esta función Lambda permite la creación masiva de registros TaskField usando DynamoDB batchWrite con paginación automática y reintentos.

## Características

- ✅ Procesamiento en lotes de hasta 25 items por request (límite de DynamoDB)
- ✅ Paginación automática para grandes volúmenes de datos
- ✅ Reintentos automáticos para items no procesados (máximo 3 intentos)
- ✅ Validación completa del input
- ✅ Generación automática de UUID y timestamps
- ✅ Logging estructurado para monitoreo
- ✅ Manejo robusto de errores

## Uso

### Via GraphQL Mutation

```graphql
mutation CreateManyTaskFields($input: String!) {
  createManyTaskFields(input: $input)
}
```

### Input Format

```json
{
  "taskFields": [
    { "taskId": "task-1", "fieldId": "field-1" },
    { "taskId": "task-2", "fieldId": "field-2" },
    { "taskId": "task-3", "fieldId": "field-3" }
  ]
}
```

### Response Format

```json
{
  "success": true,
  "inserted": 437,
  "retries": 2
}
```

### Error Response

```json
{
  "success": false,
  "inserted": 150,
  "retries": 3,
  "errors": [
    "Failed to process 25 items in chunk 3 after 3 retries"
  ]
}
```

## Configuración

### Variables de Entorno

- `TASKFIELD_TABLE`: Nombre de la tabla DynamoDB (se configura automáticamente)
- `AWS_REGION`: Región de AWS
- `LOG_LEVEL`: Nivel de logging (INFO, DEBUG, ERROR)

### Límites y Configuración

- **Timeout**: 15 minutos (900 segundos)
- **Memoria**: 1024 MB
- **Batch Size**: 25 items por request
- **Max Retries**: 3 intentos por chunk
- **Retry Delay**: 1 segundo incremental

## Deployment

1. Instalar dependencias:
```bash
cd amplify/functions/createTaskFields
npm install
```

2. Compilar TypeScript:
```bash
npm run build
```

3. Deploy con Amplify:
```bash
amplify push
```

## Permisos IAM

La función requiere los siguientes permisos en DynamoDB:
- `BatchWriteItem`
- `PutItem`
- `GetItem`
- `Query`
- `Scan`

## Monitoreo

### CloudWatch Logs

Los logs incluyen:
- Número total de items procesados
- Número de chunks creados
- Intentos de reintento por chunk
- Tiempo total de procesamiento
- Errores detallados

### Métricas Recomendadas

- Tiempo de ejecución promedio
- Tasa de éxito vs fallos
- Número de reintentos por ejecución
- Throughput (items por segundo)

## Ejemplo de Uso en Código

```typescript
import { generateClient } from 'aws-amplify/api';

const client = generateClient();

const createManyTaskFields = async (taskFields: Array<{taskId: string, fieldId: string}>) => {
  try {
    const input = JSON.stringify({ taskFields });
    
    const result = await client.graphql({
      query: `
        mutation CreateManyTaskFields($input: String!) {
          createManyTaskFields(input: $input)
        }
      `,
      variables: { input }
    });
    
    const response = JSON.parse(result.data.createManyTaskFields);
    
    if (response.success) {
      console.log(`Successfully inserted ${response.inserted} TaskField records`);
    } else {
      console.error('Errors occurred:', response.errors);
    }
    
    return response;
  } catch (error) {
    console.error('Error creating TaskFields:', error);
    throw error;
  }
};
```

## Consideraciones de Performance

- **Volumen recomendado**: Hasta 1000 items por request
- **Para volúmenes mayores**: Dividir en múltiples requests
- **Concurrencia**: La función puede manejar múltiples requests simultáneos
- **Costo**: Optimizado para minimizar costos de DynamoDB

## Troubleshooting

### Error: "Table not found"
- Verificar que la tabla TaskField existe en DynamoDB
- Confirmar que el nombre de la tabla en las variables de entorno es correcto

### Error: "Insufficient permissions"
- Verificar que la función tiene los permisos IAM necesarios
- Confirmar que el rol de ejecución está configurado correctamente

### Error: "Timeout"
- Para lotes muy grandes, considerar dividir en múltiples requests
- Aumentar el timeout de la función si es necesario

### Items no procesados
- Los items no procesados se reintentan automáticamente
- Si persisten después de 3 intentos, se reportan en el array de errores 