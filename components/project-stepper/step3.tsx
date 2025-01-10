import { useState, useEffect } from 'react';
import { Link } from '@/i18n/routing';
import { UseFormReturn } from 'react-hook-form';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { FormData } from "@/components/project-stepper/types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from '@/components/ui/label';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { FloatingActionBar } from '@/components/project-stepper/floating-action-bar';

type Step3Props = {
    methods: UseFormReturn<FormData>;
    projectId: string;
};

const mockTasks = [
    { id: '1', name: 'Generar reporte de mapa de productividad' },
    { id: '2', name: 'Validar MP con recorrida a campo' },
    { id: '3', name: 'Generar reporte de recorrida a campo' },
    { id: '4', name: 'Generar mapa de productividad' },
];

export default function Step3({ methods, projectId }: Step3Props) {
    const queryClient = useQueryClient();
    const [selectedTasks, setSelectedTasks] = useState<string[]>([]);

    // Obtenemos las selecciones de Step2
    const formValues = methods.watch();
    const matchFields = Object.keys(formValues).filter(key => key.startsWith('match_'));

    // Re-renderizar cuando los valores del formulario cambien
    methods.watch();

    // Creamos un objeto que contiene los valores de match_*
    const matchValues = matchFields.reduce((acc, field) => {
        acc[field] = formValues[field];
        return acc;
    }, {} as Record<string, string | undefined>);

    // Prefetching
    useEffect(() => {
        // Iteramos sobre matchFields para hacer el prefetching
        matchFields.forEach(field => {
            const fieldName = field.replace('match_', '');
            const queryKey = [fieldName.toLowerCase() + 's'];
            const queryFn = eval(`mockList${fieldName}s`); // Usa eval con precaución, esto es solo para el ejemplo

            if (matchValues[field] && !queryClient.getQueryData(queryKey)) {
                queryClient.prefetchQuery({
                    queryKey: queryKey,
                    queryFn: queryFn,
                });
            }
        });
    }, [matchFields, matchValues, queryClient]);

    // Consultas useQuery
    const queries = matchFields.map(field => {
        const fieldName = field.replace('match_', '');
        const queryKey = [fieldName.toLowerCase() + 's'];
        const queryFn = eval(`mockList${fieldName}s`); // Usa eval con precaución, esto es solo para el ejemplo

        return {
            queryKey,
            ...useQuery({
                queryKey: queryKey,
                queryFn: queryFn,
                enabled: !!matchValues[field],
            })
        };
    });

    // Preparamos los datos de los artefactos para cada campo personalizado seleccionado
    const customFieldsData = matchFields.reduce((acc, field) => {
        const fieldName = field.replace('match_', '');
        const query = queries.find(q => q.queryKey[0] === fieldName.toLowerCase() + 's');
        // Aseguramos que query.data sea un array antes de asignarlo
        acc[fieldName] = Array.isArray(query?.data) ? query.data : [];
        return acc;
    }, {} as Record<string, any[]>);

    const handleSelectTask = (taskId: string, checked: boolean) => {
        setSelectedTasks(prev => 
            checked 
                ? [...prev, taskId]
                : prev.filter(id => id !== taskId)
        );
    };

    const handleSelectAll = (checked: boolean) => {
        setSelectedTasks(checked ? mockTasks.map(task => task.id) : []);
    };

    const handleUpdateCustomFields = (fieldName: string, value: string) => {
        selectedTasks.forEach(taskId => {
            const selectName = `task_${taskId}_${fieldName}`;
            methods.setValue(selectName, value, { shouldValidate: true });
        });
        setSelectedTasks([]);
        // Forzar una re-renderización
        methods.trigger();
    };

    return (
        <div className="space-y-4">
            <p className="text-sm text-slate-400">Indique qué valor contendrá cada campo custom de su proyecto. Para más información visite <Link href="#" className="text-blue-700 underline">Asignando valores a campos custom de las tareas de mi proyecto</Link>.</p>
            <h3 className="mt-4">Lista de Tareas:</h3>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[30px]">
                            <Checkbox 
                                checked={selectedTasks.length === mockTasks.length}
                                onCheckedChange={handleSelectAll}
                            />
                        </TableHead>
                        <TableHead>Task</TableHead>
                        {matchFields.map((field) => (
                            <TableHead key={field}>{field.replace('match_', '')}</TableHead>
                        ))}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {mockTasks.map((task) => (
                        <TableRow key={task.id}>
                            <TableCell>
                                <Checkbox 
                                    checked={selectedTasks.includes(task.id)}
                                    onCheckedChange={(checked) => handleSelectTask(task.id, checked as boolean)}
                                />
                            </TableCell>
                            <TableCell>
                                <div className="text-sm text-muted-foreground">
                                    {task.name}
                                </div>
                            </TableCell>
                            {matchFields.map((field) => {
                                const fieldName = field.replace('match_', '');
                                const data = customFieldsData[fieldName];
                                const selectName = `task_${task.id}_${field}`;
                                return (
                                    <TableCell key={field}>
                                        <Select
                                            {...methods.register(selectName)}
                                            value={methods.watch(selectName)}
                                            onValueChange={(value) => {
                                                // Aquí asignamos el valor seleccionado al formulario
                                                methods.setValue(selectName, value, { shouldValidate: true });
                                            }}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder={`...`} />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {data?.map((item: any) => (
                                                    <SelectItem key={item.id} value={item.id}>
                                                        {item.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </TableCell>
                                );
                            })}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            <FloatingActionBar
                selectedTasks={selectedTasks}
                matchFields={matchFields}
                onClose={() => setSelectedTasks([])}
                onUpdateCustomFields={handleUpdateCustomFields}
                customFieldsData={customFieldsData}
            />
        </div>
    );
}

// Estas funciones de mock serán reemplazadas por llamadas a las correspondientes APIs
const mockListScopes = () => Promise.resolve([
    { id: '1', name: 'scope-360Workspace' },
    { id: '2', name: 'scope-360Farm' },
    { id: '3', name: 'scope-360Field' }
]);

const mockListTask_Types = () => Promise.resolve([
    { id: '1', name: 'Task' },
    { id: '2', name: 'Field_Visit' },
    { id: '3', name: 'Tillage' },
]);

const mockListAreas = () => Promise.resolve([
    { id: '1', name: 'Area 1' },
    { id: '2', name: 'Area 2' }
]);

const mockListWorkspaces = () => Promise.resolve([
    { id: '1', name: 'Workspace 1' },
    { id: '2', name: 'Workspace 2' }
]);

const mockListSeasons = () => Promise.resolve([
    { id: '1', name: '2023-24' },
    { id: '2', name: '2024-25' }
]);

const mockListFarms = () => Promise.resolve([
    { id: '1', name: 'Farm 1' },
    { id: '2', name: 'Farm 2' }
]);

const mockListFields = () => Promise.resolve([
    { id: '1', name: 'Field 1' },
    { id: '2', name: 'Field 2' }
]);

const mockListCollect_Forms = () => Promise.resolve([
    { id: '1', name: 'Crop Monitoring' },
    { id: '2', name: 'Other Survey' }
]);

