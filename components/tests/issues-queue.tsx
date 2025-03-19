'use client'; // Indicamos que este es un Client Component

import { useState, useEffect } from 'react';
import { getQueueIssues } from '@/lib/jira';
// import { QueueIssueResponse } from '@/lib/interfaces';

export default function QueueIssuesComponent() {
    // Estados para manejar los datos, errores y estado de carga
    const [issues, setIssues] = useState<any[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    // useEffect para cargar los datos al montar el componente
    useEffect(() => {
        const fetchIssues = async () => {
            try {
                setLoading(true);
                const result = await getQueueIssues("TEM", 84);

                if (result.success) {
                    setIssues(result.data?.values);
                } else {
                    setError(result.error || 'Error desconocido');
                }
            } catch (err) {
                setError('Error al cargar los issues');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchIssues();
    }, []); // Array vacío significa que solo se ejecuta al montar el componente

    // Renderizado condicional basado en el estado
    if (loading) {
        return (
            <div className="p-4">
                <p>Cargando issues...</p>
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
            <h2 className="text-xl font-bold mb-4">Repositorio de protocolos</h2>
            {issues.length > 0 ? (
                <ul className="list-disc pl-5">
                    {issues.map((issue, index) => (
                        <li key={index} className="mb-2">
                            {index + 1} . {issue.key} {issue.fields.summary} {issue.fields.labels}
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No se encontraron issues en la queue</p>
            )}
        </div>
    );
}