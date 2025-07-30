# Instrucciones de Deployment - Función Lambda createTaskFields

## Resumen
Esta función Lambda permite la creación masiva de registros TaskField usando DynamoDB batchWrite con paginación automática y reintentos.

## Archivos Creados

### 1. Función Lambda
- `amplify/functions/createTaskFields/index.ts` - Código principal de la función
- `amplify/functions/createTaskFields/package.json` - Dependencias
- `amplify/functions/createTaskFields/tsconfig.json` - Configuración TypeScript
- `amplify/functions/createTaskFields/resource.ts` - Definición del recurso Amplify
- `amplify/functions/createTaskFields/README.md` - Documentación completa

### 2. Configuración Amplify
- `amplify/backend.ts` - Actualizado para incluir la función
- `amplify/data/resource.ts` - Agregada mutation GraphQL personalizada

### 3. Frontend
- `lib/services/task-field-batch-service.ts` - Servicio simplificado para usar la función

## Pasos de Deployment

### 1. Instalar Dependencias
```bash
cd amplify/functions/createTaskFields
npm install
```

### 2. Compilar TypeScript
```bash
npm run build
```

### 3. Deploy con Amplify
```bash
# Desde la raíz del proyecto
amplify push
```

### 4. Verificar Deployment
```bash
# Verificar que la función se creó correctamente
amplify status
```

## Configuración de AWS

### Permisos IAM Automáticos
Amplify configurará automáticamente los permisos IAM necesarios:
- `dynamodb:BatchWriteItem`
- `dynamodb:PutItem`
- `dynamodb:GetItem`
- `dynamodb:Query`
- `dynamodb:Scan`

### Variables de Entorno
Se configuran automáticamente:
- `TASKFIELD_TABLE`: Nombre de la tabla DynamoDB
- `AWS_REGION`: Región de AWS
- `LOG_LEVEL`: Nivel de logging

## Uso

### Via GraphQL
```graphql
mutation CreateManyTaskFields($input: String!) {
  createManyTaskFields(input: $input)
}
```

### Via Frontend
```typescript
import { TaskFieldBatchService } from '@/lib/services/task-field-batch-service';

const result = await TaskFieldBatchService.createManyTaskFields([
  { taskId: "task-1", fieldId: "field-1" },
  { taskId: "task-2", fieldId: "field-2" }
]);
```

### Via Formularios Existentes
```tsx
import { TaskFieldBatchService } from '@/lib/services/task-field-batch-service';
import { useToast } from '@/hooks/use-toast';

const { toast } = useToast();

// En el handleSubmit de tus formularios
if (taskFields.length > 0) {
  // Mostrar toast informativo si es un proceso batch grande
  if (TaskFieldBatchService.shouldShowBatchInfo(taskFields.length)) {
    toast({
      title: "Procesando relaciones Task-Field",
      description: TaskFieldBatchService.getBatchInfoMessage(taskFields.length),
      duration: 5000,
    });
  }
  
  const result = await TaskFieldBatchService.createManyTaskFields(taskFields);
  
  if (result.success) {
    toast({
      title: "¡Éxito!",
      description: `Se crearon ${result.inserted} relaciones Task-Field exitosamente`,
    });
  }
}
```

## Monitoreo

### CloudWatch Logs
- Logs automáticos en `/aws/lambda/createTaskFields-{env}-{projectName}`
- Incluye métricas de performance y errores

### Métricas Recomendadas
- Tiempo de ejecución promedio
- Tasa de éxito vs fallos
- Número de reintentos por ejecución
- Throughput (items por segundo)

## Troubleshooting

### Error: "Table not found"
- Verificar que la tabla TaskField existe en DynamoDB
- Confirmar que el nombre de la tabla es correcto

### Error: "Insufficient permissions"
- Verificar que la función tiene los permisos IAM necesarios
- Ejecutar `amplify push` nuevamente

### Error: "Timeout"
- Para lotes muy grandes, dividir en múltiples requests
- Aumentar el timeout en `resource.ts` si es necesario

## Consideraciones de Performance

- **Volumen recomendado**: Hasta 1000 items por request
- **Para volúmenes mayores**: La función maneja automáticamente la paginación
- **Concurrencia**: La función puede manejar múltiples requests simultáneos
- **Costo**: Optimizado para minimizar costos de DynamoDB
- **UX**: Toast informativo automático para procesos batch grandes (>50 items)

## Limpieza

Para eliminar la función:
```bash
amplify remove createTaskFields
amplify push
```

## Notas Importantes

1. **Escalabilidad**: Esta solución resuelve el problema de límites de GraphQL para grandes volúmenes
2. **Confiabilidad**: Reintentos automáticos y manejo robusto de errores
3. **Monitoreo**: Logging completo para debugging y optimización
4. **Costo**: Optimizado para minimizar costos de DynamoDB y Lambda
5. **Mantenimiento**: Código limpio y bien documentado para fácil mantenimiento 