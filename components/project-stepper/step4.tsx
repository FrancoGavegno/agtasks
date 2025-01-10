import { UseFormReturn } from 'react-hook-form';
import { FormData } from '@/components/project-stepper/types';

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
            <p className="text-sm text-slate-400">Verifique que los campos custom y valores seleccionados en cada paso estén correctos. Confirme para finalizar.</p>
            <p>Step 1: </p>
            <p><strong>Name:</strong> {formData.name || 'Not provided'}</p>
            <p><strong>Description:</strong> {formData.description || 'Not provided'}</p>

            <p>Step 2: </p>
            <p><strong>Field Matching:</strong></p>
            <ul>
                {Object.entries(formData).filter(([key]) => key.startsWith('match_') && !key.startsWith('task_')).map(([key, value]) => (
                    <li key={key}><strong>{key.replace('match_', '')}:</strong> {value as string}</li>
                ))}
            </ul>

            <p>Step 3: </p>
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


            {/* <p><strong>Generic Fields:</strong></p>
            <ul>
                {Object.entries(formData).filter(([key]) =>
                    !['name', 'description'].includes(key) &&
                    !key.startsWith('match_') 
                ).map(([key, value]) => (
                    <li key={key}><strong>{key}:</strong> {value as string || 'Not provided'}</li>
                ))}
            </ul> */}


            <p><strong>Object Representation:</strong></p>
            <pre>{JSON.stringify(formData, null, 2)}</pre>

        </div>
    );

    // return (
    //     <div className="space-y-4">
    //         <p><strong>Name:</strong> {formData.name}</p>

    //         <p><strong>Description:</strong> {formData.description}</p>

    //         <p><strong>Field Matching:</strong></p>
    //         <ul>
    //             {Object.entries(formData).filter(([key]) => key.startsWith('match_') && !key.startsWith('task_')).map(([key, value]) => (
    //                 <li key={key}><strong>{key.replace('match_', '')}:</strong> {value as string}</li>
    //             ))}
    //         </ul>

    //         <p><strong>Selected Artifacts:</strong></p>
    //         <ul>
    //             {Object.entries(formData).filter(([key]) => key.startsWith('selected') && !key.startsWith('task_')).map(([key, value]) => (
    //                 <li key={key}><strong>{key.replace('selected', '')}:</strong> {value as string}</li>
    //             ))}
    //         </ul>

    //         <p><strong>Tasks Configuration:</strong></p>
    //         <ul>
    //             {Object.entries(formData).filter(([key]) => key.startsWith('task_')).map(([key, value]) => {
    //                 if (key.includes('match_')) {
    //                     const taskId = key.split('_')[1];
    //                     const fieldName = key.replace(`task_${taskId}_match_`, '');
    //                     return (
    //                         <li key={key}>
    //                             <strong>Task {taskId} - {fieldName}:</strong> {value as string}, 
    //                             Selected: {formData[key.replace('match_', 'selected')] as string}
    //                         </li>
    //                     );
    //                 }
    //                 return null;
    //             })}
    //         </ul>

    //         <p><strong>Object Representation:</strong></p>
    //         <pre>{JSON.stringify(formData, null, 2)}</pre>

    //         {/* <button onClick={methods.handleSubmit(handleSubmit)}>Submit and Update Tasks</button> */}
    //     </div>
    // );
}