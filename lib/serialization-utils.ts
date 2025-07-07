
// Utility function to serialize model data
export function serializeModelData<T extends Record<string, any>>(data: T): Omit<T, keyof T & Function> {
  const serialized = {} as Partial<T>
  for (const [key, value] of Object.entries(data)) {
    if (typeof value !== "function") {
      // Type assertion is safe here because we check for non-function
      serialized[key as keyof T] = value
    }
  }
  return serialized as Omit<T, keyof T & Function>
}

// export function serializeModelArray<T extends Record<string, any>>(data: T[]): Omit<T, keyof T & Function>[] {
//   return data.map((item) => serializeModelData(item))
// }

// Type-safe serialization for specific models
export type SerializedProject = Omit<any, "services" | "tasks"> & {
  services?: any[]
  tasks?: any[]
}

export type SerializedService = Omit<any, "project" | "tasks"> & {
  project?: any
  tasks?: any[]
}

export type SerializedTask = Omit<any, "project" | "service" | "fields"> & {
  project?: any
  service?: any
  fields?: any[]
}

export type SerializedField = Omit<any, "task"> & {
  task?: any
}
