'use client'

import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import DynamicForm from '@/components/dynamic-form/dynamic-form';

export default function Page() {
    // http://localhost:3000/en/task/868bxg9b6/edit

    // getTask 
    // https://developer.clickup.com/reference/gettask 

    // getCustomTaskTypes
    // https://developer.clickup.com/reference/getcustomitems
    
    const { taskId, taskType } = useParams();
    const [jsonFiles, setJsonFiles] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [taskTypeForm, setTaskTypeForm] = useState<string>("regular_task");

    useEffect(() => {
        async function fetchJsonFiles() {
            try {
                const response = await fetch('/api/json-files');
                const files = await response.json();
                setJsonFiles(files);

                if (taskType==="1001") {
                    setTaskTypeForm("field_visit"); 
                } 
                if (taskType==="1002"){
                    setTaskTypeForm("tillage");
                }

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
        file.toLowerCase() === `${taskTypeForm}.json`.toLowerCase()
    );

    if (loading) {
        return <p>Loading...</p>;
    }

    return (
        <main className="container mx-auto p-4">
            <h2 className="text-2xl font-bold mb-4">Editando tarea</h2>
            {matchingFile ? (
                <DynamicForm jsonUrl={`/data/${matchingFile}`} />
            ) : (
                <p>No se encontró un formulario para el tipo de tarea: {taskTypeForm}</p>
            )}
        </main>
    );
}


