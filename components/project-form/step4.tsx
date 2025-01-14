import { UseFormReturn } from 'react-hook-form';
import { FormData } from '@/lib/types';

type Step4Props = {
    methods: UseFormReturn<FormData>;
};

export default function Step4({ methods }: Step4Props) {
    const formData = methods.watch();

    // Función simulada para actualizar una tarea en ClickUp
    const updateTaskInClickUp = async (taskId: string, customFields: Record<string, string>) => {
        // Aquí deberías hacer la llamada real a la API de ClickUp usando fetch o axios
        // Por ahora, solo simulamos la llamada con un console.log
        console.log(`Simulación de actualización de tarea ${taskId} en ClickUp con custom fields:`, customFields);
    };

    // Simulamos la actualización de las tareas al hacer submit
    const handleSubmit = async () => {
        const tasks = [
            { id: '1', name: 'Generar reporte de mapa de productividad' },
            { id: '2', name: 'Validar MP con recorrida a campo' },
            { id: '3', name: 'Generar reporte de recorrida a campo' },
            { id: '4', name: 'Generar mapa de productividad' },
        ];

        for (const task of tasks) {
            const customFields = Object.keys(formData).reduce((acc, key) => {
                if (key.startsWith(`task_${task.id}_match_`)) {
                    const customFieldName = key.replace(`task_${task.id}_match_`, '');
                    const selectedValue = formData[`task_${task.id}_${key.replace('match_', 'selected')}`];
                    if (selectedValue) {
                        acc[customFieldName] = selectedValue;
                    }
                }
                return acc;
            }, {} as Record<string, string>);

            await updateTaskInClickUp(task.id, customFields);
        }

        console.log('Todas las tareas han sido actualizadas en ClickUp.');
    };

    return (
        <div className="space-y-4">
            <p className="text-sm text-slate-400">Verifique que la información esté correcta. Confirme para finalizar.</p>
            
            <p><strong>Selected Template:</strong></p>
            <p>Name: {formData.name || 'Not provided'}</p>
            
            <p><strong>Field Matching:</strong></p>
            <ul>
                {Object.entries(formData).filter(([key]) => key.startsWith('match_') && !key.startsWith('task_')).map(([key, value]) => (
                    <li key={key}><strong>{key.replace('match_', '')}:</strong> {value as string}</li>
                ))}
            </ul>

            <p><strong>Selected Artifacts:</strong></p>
            <ul>
                {['1', '2', '3', '4'].map(taskId => (
                    <li key={taskId}>
                        <strong>Task {taskId}</strong>
                        <ul>
                            {Object.keys(formData).filter(key => key.startsWith(`task_${taskId}_match_`)).map(key => {
                                const parts = key.split('_');
                                const fieldName = parts.slice(2).join('_');
                                const selectedKey = key.replace('match_', 'selected');
                                return (
                                    <li key={key}>
                                        <strong>{fieldName}:</strong> {formData[key] ? formData[key] as string : 'Not selected'}
                                    </li>
                                );
                            })}
                        </ul>
                    </li>
                ))}
            </ul>
            {/* <p><strong>Object Representation:</strong></p>
            <pre>{JSON.stringify(formData, null, 2)}</pre> */}
        </div>
    );
}