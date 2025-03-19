'use client';

import { useState, useEffect } from 'react';
import { getServiceRequestIssues, getSubtasksForIssue } from '@/lib/jira';

export default function ServiceRequestSubtasks() {
  const [parentIssues, setParentIssues] = useState<any[]>([]);
  const [subtasks, setSubtasks] = useState<Record<string, any[]>>({}); // Mapeo de subtareas por issueKey
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const REQUEST_TYPE = 87; // Tipo de request específico

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // 1. Obtener issues padre
        const parentResult = await getServiceRequestIssues(REQUEST_TYPE);
        if (!parentResult.success) throw new Error(parentResult.error);

        const parentIssuesData = parentResult.data as any[];
        setParentIssues(parentIssuesData);

        // 2. Obtener subtareas para cada issue padre
        const subtasksMap: Record<string, any[]> = {};
        for (const issue of parentIssuesData) {
          const subtasksResult = await getSubtasksForIssue(issue.key);
          if (subtasksResult.success) {
            subtasksMap[issue.key] = subtasksResult.data;
          }
        }
        setSubtasks(subtasksMap);

      } catch (err: any) {
        setError(err.message || 'Error al cargar los datos de Jira');
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="p-4">
        <p>Cargando issues y subtareas...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-red-500">
        <p>Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Service Requests y Subtareas</h2>
      {parentIssues.length > 0 ? (
        <div className="space-y-4">
          {parentIssues.map((issue: any) => (
            <div key={issue.key} className="border p-3 rounded">
              <h3 className="font-semibold">Issue Padre: {issue.key}</h3>
              {subtasks[issue.key]?.length > 0 ? (
                <ul className="list-disc pl-5 mt-2">
                  {subtasks[issue.key].map((subtask: any) => (
                    <li key={subtask.key} className="mb-1">
                      {subtask.key} - {subtask.fields.summary || 'Sin resumen'} 
                      ({subtask.fields.status?.name || 'Sin estado'})
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500 mt-2">No hay subtareas</p>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p>No se encontraron Service Requests con el tipo especificado</p>
      )}
    </div>
  );
}