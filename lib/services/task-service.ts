import { apiClient } from "@/lib/integrations/amplify";
import { createIssue, generateDescriptionField } from "@/lib/integrations/jira";
import type { 
  UnifiedTaskOperation, 
  TaskFormValues, 
  Task,
  CreateTaskInput,
  UpdateTaskInput 
} from "@/lib/schemas";

export interface TaskServiceResult {
  task: Task;
  fieldIds: number[];
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
      // Normalize taskData to ensure it's a valid JSON string or null
      const normalizedTaskData = this.normalizeTaskData(formData.taskData);

      // For creation mode, if taskData is not meaningful, send null
      const finalTaskData = operation === 'create' && !normalizedTaskData ? null : normalizedTaskData;

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
        workspaceId: formData.workspaceId,
        workspaceName: formData.workspaceName,
        seasonId: formData.seasonId,
        seasonName: formData.seasonName,
        farmId: formData.farmId,
        farmName: formData.farmName,
        fieldIdsOnlyIncluded: formData.fieldIdsOnlyIncluded,        
        operation,
        taskId,
      };

      // Process the unified operation
      const result = await apiClient.processUnifiedTaskOperation(unifiedData);

      // Handle Jira integration if requested
      let jiraIssueKey: string | undefined;
      if (options.createJiraIssue && operation === 'create') {
        jiraIssueKey = await this.createJiraIssue(formData, result.task.id!, options);
      }

      return {
        task: result.task,
        fieldIds: (result.fieldIds || []).map(id => Number(id)),
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
   * Load a task for editing
   */
  static async loadTaskForEdit(taskId: string): Promise<{ task: Task }> {
    try {
      const task = await apiClient.getTask(taskId);
      return { task };
    } catch (error) {
      console.error('Error loading task for edit:', error);
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
      // Generate description from fieldIdsOnlyIncluded if available
      let descriptionPlain = "";
      if (formData.fieldIdsOnlyIncluded && formData.fieldIdsOnlyIncluded.length > 0) {
        descriptionPlain = `Task applies to specific fields: ${formData.fieldIdsOnlyIncluded.join(', ')}`;
      } else {
        descriptionPlain = "Task applies to all fields in the establishment";
      }

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
    userEmail?: string;
  }): TaskFormValues {
    return {
      ...formData,
      userEmail: tempData?.userEmail || formData.userEmail,
      taskData: tempData?.taskData 
        ? this.normalizeTaskData(tempData.taskData)
        : this.normalizeTaskData(formData.taskData),
      // Ensure 360 Farm fields are preserved
      workspaceId: formData.workspaceId,
      workspaceName: formData.workspaceName,
      seasonId: formData.seasonId,
      seasonName: formData.seasonName,
      farmId: formData.farmId,
      farmName: formData.farmName,
      fieldIdsOnlyIncluded: formData.fieldIdsOnlyIncluded,
    };
  }
}