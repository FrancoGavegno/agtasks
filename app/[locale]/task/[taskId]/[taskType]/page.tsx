'use client'

import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import DynamicForm from '@/components/dynamic-form/dynamic-form';

export default function Page() {
  const { taskId, taskType } = useParams();
  const [jsonFiles, setJsonFiles] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchJsonFiles() {
      try {
        const response = await fetch('/api/json-files');
        const files = await response.json();
        setJsonFiles(files);
      } catch (error) {
        console.error('Error fetching JSON files:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchJsonFiles();
  }, []);

  // Find the matching JSON file (case-insensitive)
  const matchingFile = jsonFiles.find(file => 
    file.toLowerCase() === `${taskType}.json`.toLowerCase()
  );

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <main className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Formulario Dinámico</h1>
      <p>ID de la Tarea: {taskId}</p>
      <p>Tipo de Tarea: {taskType}</p>
      {matchingFile ? (
        <DynamicForm jsonUrl={`/data/${matchingFile}`} />
      ) : (
        <p>No se encontró un formulario para el tipo de tarea: {taskType}</p>
      )}
    </main>
  );
}


