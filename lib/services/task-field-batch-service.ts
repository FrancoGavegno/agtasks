import { apiClient } from '@/lib/integrations/amplify';

export interface TaskFieldInput {
  taskId: string;
  fieldId: string;
}

export interface BatchTaskFieldResult {
  success: boolean;
  inserted: number;
  retries: number;
  errors?: string[];
}

/**
 * Servicio para creación masiva de TaskField usando la Lambda function
 * Maneja automáticamente tanto lotes pequeños como grandes
 */
export class TaskFieldBatchService {
  
  /**
   * Crea múltiples registros TaskField en lote
   * Maneja automáticamente la paginación para grandes volúmenes
   * @param taskFields Array de objetos con taskId y fieldId
   * @param batchSize Tamaño de cada lote (default: 500)
   * @returns Resultado del procesamiento con estadísticas
   */
  static async createManyTaskFields(
    taskFields: TaskFieldInput[], 
    batchSize: number = 500
  ): Promise<BatchTaskFieldResult> {
    const totalItems = taskFields.length;
    let totalInserted = 0;
    let totalRetries = 0;
    const allErrors: string[] = [];

    console.log(`Procesando ${totalItems} TaskFields en lotes de ${batchSize}`);

    // Dividir en lotes
    for (let i = 0; i < taskFields.length; i += batchSize) {
      const batch = taskFields.slice(i, i + batchSize);
      const batchNumber = Math.floor(i / batchSize) + 1;
      const totalBatches = Math.ceil(taskFields.length / batchSize);

      console.log(`Procesando lote ${batchNumber}/${totalBatches} con ${batch.length} items`);

      try {
        // Preparar input para la mutation
        const input = JSON.stringify({ taskFields: batch });

        // Usar la función batch del apiClient
        const results = await apiClient.createTaskFieldsBatch(batch);
        
        // Contar resultados
        const response = {
          inserted: results.length,
          retries: 0,
          errors: []
        };
        
        totalInserted += response.inserted;
        totalRetries += response.retries;
        
        if (response.errors) {
          allErrors.push(...response.errors.map((err: string) => `Lote ${batchNumber}: ${err}`));
        }

        // Pequeña pausa entre lotes para evitar throttling
        if (batchNumber < totalBatches) {
          await new Promise(resolve => setTimeout(resolve, 100));
        }

      } catch (error) {
        const errorMsg = `Error en lote ${batchNumber}: ${error instanceof Error ? error.message : 'Error desconocido'}`;
        allErrors.push(errorMsg);
        console.error(errorMsg);
      }
    }

    const success = allErrors.length === 0;
    
    console.log(`Procesamiento completado. Insertados: ${totalInserted}, Reintentos: ${totalRetries}, Errores: ${allErrors.length}`);

    return {
      success,
      inserted: totalInserted,
      retries: totalRetries,
      errors: allErrors.length > 0 ? allErrors : undefined
    };
  }

  /**
   * Determina si se debe mostrar un toast informativo sobre el proceso batch
   * @param taskFieldsCount Número de TaskFields a procesar
   * @returns true si se debe mostrar el toast informativo
   */
  static shouldShowBatchInfo(taskFieldsCount: number): boolean {
    // Mostrar info si hay más de 50 TaskFields (aproximadamente 2-3 lotes)
    return taskFieldsCount > 50;
  }

  /**
   * Obtiene el mensaje informativo para el toast de proceso batch
   * @param taskFieldsCount Número de TaskFields a procesar
   * @returns Mensaje informativo
   */
  static getBatchInfoMessage(taskFieldsCount: number): string {
    if (taskFieldsCount <= 100) {
      return `Procesando ${taskFieldsCount} relaciones Task-Field. Esto puede tomar unos segundos...`;
    } else if (taskFieldsCount <= 500) {
      return `Procesando ${taskFieldsCount} relaciones Task-Field. Este proceso puede demorar entre 30 segundos y 2 minutos...`;
    } else {
      return `Procesando ${taskFieldsCount} relaciones Task-Field. Este proceso puede demorar varios minutos. Por favor, no cierres la página...`;
    }
  }
}

// Exportar función para uso directo
export const createManyTaskFields = TaskFieldBatchService.createManyTaskFields;

/*
EJEMPLO DE USO EN FORMULARIOS EXISTENTES:

// En services/stepper.tsx, tasks/create-task.tsx, tasks/stepper.tsx
import { TaskFieldBatchService } from '@/lib/services/task-field-batch-service';
import { useToast } from '@/hooks/use-toast';

const { toast } = useToast();

const handleSubmit = async (formData) => {
  try {
    // ... lógica existente para crear Task/Service
    
    // Si hay TaskFields para crear
    if (taskFields.length > 0) {
      // Mostrar toast informativo si es un proceso batch grande
      if (TaskFieldBatchService.shouldShowBatchInfo(taskFields.length)) {
        toast({
          title: "Procesando relaciones Task-Field",
          description: TaskFieldBatchService.getBatchInfoMessage(taskFields.length),
          duration: 5000,
        });
      }
      
      // Crear TaskFields usando el proceso batch
      const result = await TaskFieldBatchService.createManyTaskFields(taskFields);
      
      if (result.success) {
        toast({
          title: "¡Éxito!",
          description: `Se crearon ${result.inserted} relaciones Task-Field exitosamente`,
        });
      } else {
        toast({
          title: "Procesamiento completado con errores",
          description: `${result.inserted} relaciones creadas, ${result.errors?.length} errores`,
          variant: "destructive",
        });
      }
    }
    
  } catch (error) {
    // ... manejo de errores existente
  }
};
*/ 