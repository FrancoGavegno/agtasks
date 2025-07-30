import { apiClient } from "@/lib/integrations/amplify";
import { createIssue, generateDescriptionField } from "@/lib/integrations/jira";
import type { 
  UnifiedTaskOperation, 
  TaskFormValues, 
  Field,
  Task,
  CreateTaskInput,
  UpdateTaskInput 
} from "@/lib/schemas";

export interface TaskServiceResult {
  task: Task;
  fieldIds: string[];
  jiraIssueKey?: string;
}

export interface TaskServiceOptions {
  createJiraIssue?: boolean;
  jiraParentKey?: string;
  agtasksUrl?: string;
}

export class TaskService {
  /**
   * Unified method to process task operations (create or update)
   * This method handles both creation and editing with a single interface
   */
  static async processTask(
    formData: TaskFormValues,
    operation: 'create' | 'update',
    taskId?: string,
    options: TaskServiceOptions = {}
  ): Promise<TaskServiceResult> {
    try {
      console.log("TaskService.processTask called with:", {
        operation,
        taskId,
        formDataKeys: Object.keys(formData),
        fieldsCount: formData.fields?.length,
        taskData: formData.taskData
      });

      // Normalize taskData to ensure it's a valid JSON string or null
      const normalizedTaskData = this.normalizeTaskData(formData.taskData);
      console.log("Normalized taskData:", normalizedTaskData);
      console.log("Normalized taskData type:", typeof normalizedTaskData);
      console.log("Normalized taskData length:", normalizedTaskData ? normalizedTaskData.length : 'null');

      // For creation mode, if taskData is not meaningful, send null
      const finalTaskData = operation === 'create' && !normalizedTaskData ? null : normalizedTaskData;
      console.log("Final taskData for Amplify:", finalTaskData);

      // Clean empty strings and convert to null for optional fields
      const cleanServiceId = formData.serviceId?.trim() || undefined;
      const cleanFormId = formData.formId?.trim() || undefined;

      // Prepare unified operation data
      const unifiedData: UnifiedTaskOperation = {
        taskName: formData.taskName,
        taskType: formData.taskType,
        userEmail: formData.userEmail,
        projectId: formData.projectId,
        serviceId: cleanServiceId,
        taskData: finalTaskData,
        formId: cleanFormId,
        fields: formData.fields,
        operation,
        taskId,
      };

      console.log("Unified data prepared:", {
        operation: unifiedData.operation,
        taskId: unifiedData.taskId,
        taskName: unifiedData.taskName,
        userEmail: unifiedData.userEmail,
        fieldsCount: unifiedData.fields?.length,
        taskData: unifiedData.taskData,
        serviceId: unifiedData.serviceId,
        formId: unifiedData.formId
      });

      // Process the unified operation
      const result = await apiClient.processUnifiedTaskOperation(unifiedData);

      // Handle Jira integration if requested
      let jiraIssueKey: string | undefined;
      if (options.createJiraIssue && operation === 'create') {
        jiraIssueKey = await this.createJiraIssue(formData, result.task.id!, options);
      }

      return {
        task: result.task,
        fieldIds: result.fieldIds,
        jiraIssueKey,
      };
    } catch (error) {
      console.error('Error in TaskService.processTask:', error);
      throw error;
    }
  }

  /**
   * Create a new task with all its dependencies
   */
  static async createTask(
    formData: TaskFormValues,
    options: TaskServiceOptions = {}
  ): Promise<TaskServiceResult> {
    return this.processTask(formData, 'create', undefined, options);
  }

  /**
   * Update an existing task with all its dependencies
   */
  static async updateTask(
    formData: TaskFormValues,
    taskId: string,
    options: TaskServiceOptions = {}
  ): Promise<TaskServiceResult> {
    return this.processTask(formData, 'update', taskId, options);
  }

  /**
   * Load a task with all its associated fields for editing
   */
  static async loadTaskForEdit(taskId: string): Promise<{ task: Task; fields: Field[] }> {
    try {
      return await apiClient.getTaskWithFields(taskId);
    } catch (error) {
      console.error('Error loading task for edit:', error);
      throw error;
    }
  }

  /**
   * Validate task field associations
   * This method determines if TaskField associations should be created or deleted
   */
  static async validateTaskFieldAssociations(
    taskId: string,
    targetFieldIds: string[]
  ): Promise<{
    toCreate: string[];
    toDelete: string[];
    toKeep: string[];
  }> {
    try {
      // Get current task field associations
      const currentTaskFields = await apiClient.listTaskFields(taskId);
      
      // Get current field details for comparison
      const currentFields = await Promise.all(
        currentTaskFields.items.map(async (tf) => {
          const field = await apiClient.getField(tf.fieldId);
          return {
            taskFieldId: tf.id,
            fieldId: tf.fieldId,
            field360Id: field.fieldId, // 360 field ID for comparison
          };
        })
      );

      // Create sets for efficient comparison
      const currentField360Ids = new Set(currentFields.map(cf => cf.field360Id));
      const targetField360Ids = new Set(targetFieldIds);

      // Find fields to remove (in current but not in target)
      const fieldsToRemove = currentFields.filter(cf => !targetField360Ids.has(cf.field360Id));
      
      // Find fields to add (in target but not in current)
      const fieldsToAdd = targetFieldIds.filter(tf => !currentField360Ids.has(tf));

      // Find fields to keep (in both current and target)
      const fieldsToKeep = currentFields
        .filter(cf => targetField360Ids.has(cf.field360Id))
        .map(cf => cf.fieldId);

      return {
        toCreate: fieldsToAdd,
        toDelete: fieldsToRemove.map(fr => fr.taskFieldId!),
        toKeep: fieldsToKeep,
      };
    } catch (error) {
      console.error('Error validating task field associations:', error);
      throw error;
    }
  }

  /**
   * Create Jira issue for a task
   */
  private static async createJiraIssue(
    formData: TaskFormValues,
    taskId: string,
    options: TaskServiceOptions
  ): Promise<string> {
    try {
      // Generate description from fields
      const { descriptionPlain } = await generateDescriptionField(formData.fields as Field[]);

      // Create issue in Jira
      const jiraResponse = await createIssue(
        options.jiraParentKey || "TAN", // Default parent key
        formData.taskName,
        formData.userEmail,
        descriptionPlain,
        options.agtasksUrl || "",
        formData.taskType,
      );

      if (!jiraResponse?.key) {
        throw new Error("Failed to create Jira issue - no key returned");
      }

      // Update task with Jira issue key
      await apiClient.updateTask(taskId, { 
        subtaskId: jiraResponse.key, 
        tmpSubtaskId: "" 
      });

      return jiraResponse.key;
    } catch (error) {
      console.error('Error creating Jira issue:', error);
      throw error;
    }
  }

  /**
   * Normalize task data to ensure it's a valid JSON string or null
   */
  static normalizeTaskData(taskData: any): string | null {
    if (!taskData) return null;
    
    // If it's already a string, try to validate it as JSON
    if (typeof taskData === 'string') {
      try {
        // Try to parse it to validate it's valid JSON
        JSON.parse(taskData);
        return taskData;
      } catch {
        // If it's not valid JSON, wrap it in a simple object
        return JSON.stringify({ value: taskData });
      }
    }
    
    // If it's an object, stringify it
    if (typeof taskData === 'object' && taskData !== null) {
      // Check if the object has any meaningful properties
      const keys = Object.keys(taskData);
      if (keys.length === 0) return null;
      
      // Check if all values are not empty strings, null, or undefined
      const hasValidValues = keys.some(key => {
        const value = taskData[key];
        return value !== null && value !== undefined && value !== '';
      });
      
      if (!hasValidValues) return null;
      
      return JSON.stringify(taskData);
    }
    
    // For any other type, wrap it in an object and stringify
    if (taskData !== null && taskData !== undefined && taskData !== '') {
      return JSON.stringify({ value: taskData });
    }
    
    return null;
  }

  /**
   * Prepare form data for database operations
   */
  static prepareFormData(formData: TaskFormValues, tempData?: {
    taskData?: Record<string, any> | null;
    fields?: any[];
    userEmail?: string;
  }): TaskFormValues {
    return {
      ...formData,
      userEmail: tempData?.userEmail || formData.userEmail,
      taskData: tempData?.taskData 
        ? this.normalizeTaskData(tempData.taskData)
        : this.normalizeTaskData(formData.taskData),
      fields: tempData?.fields?.length ? tempData.fields : formData.fields,
    };
  }
}