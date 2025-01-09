import { useEffect } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { FormData } from "@/components/stepper/types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from '../ui/label';

type Step3Props = {
    methods: UseFormReturn<FormData>;
    projectId: string;
};

export default function Step3({ methods, projectId }: Step3Props) {
    const queryClient = useQueryClient();

    // Obtener las selecciones del Step2
    const formValues = methods.watch();
    const match_Scope = formValues['match_Scope'];
    const match_Task_Type = formValues['match_Task_Type'];
    const match_Area = formValues['match_Area'];
    const match_Workspace = formValues['match_Workspace'];
    const match_Season = formValues['match_Season'];
    const match_Farm = formValues['match_Farm'];
    const match_Field = formValues['match_Field'];
    const match_Collect_Form = formValues['match_Collect_Form'];


    // Funciones para realizar peticiones solo si el match correspondiente está seleccionado
    useEffect(() => {
        if (match_Scope && !queryClient.getQueryData(['scopes'])) {
            queryClient.prefetchQuery({
                queryKey: ['scopes'],
                queryFn: mockListScopes,
            });
        }

        if (match_Task_Type && !queryClient.getQueryData(['taskTypes'])) {
            queryClient.prefetchQuery({
                queryKey: ['taskTypes'],
                queryFn: mockListTaskTypes
            });
        }

        if (match_Area && !queryClient.getQueryData(['areas'])) {
            queryClient.prefetchQuery({
                queryKey: ['areas'],
                queryFn: mockListAreas
            });
        }

        if (match_Workspace && !queryClient.getQueryData(['workspaces'])) {
            queryClient.prefetchQuery({
                queryKey: ['workspaces'],
                queryFn: mockListWorkspaces
            });
        }

        if (match_Season && !queryClient.getQueryData(['seasons'])) {
            queryClient.prefetchQuery({
                queryKey: ['seasons'],
                queryFn: mockListSeasons
            });
        }

        if (match_Farm && !queryClient.getQueryData(['farms'])) {
            queryClient.prefetchQuery({
                queryKey: ['farms'],
                queryFn: mockListFarms
            });
        }

        if (match_Field && !queryClient.getQueryData(['fields'])) {
            queryClient.prefetchQuery({
                queryKey: ['fields'],
                queryFn: mockListFields
            });
        }

        if (match_Collect_Form && !queryClient.getQueryData(['collectForms'])) {
            queryClient.prefetchQuery({
                queryKey: ['collectForms'],
                queryFn: mockListProjects
            });
        }

    }, [match_Scope, match_Task_Type, match_Area, match_Workspace, match_Season, match_Farm, match_Field, match_Collect_Form, queryClient]);


    const scopesQuery = useQuery({
        queryKey: ['scopes'],
        queryFn: mockListScopes,
        enabled: !!match_Scope,
    });

    const taskTypesQuery = useQuery({
        queryKey: ['taskTypes'],
        queryFn: mockListTaskTypes,
        enabled: !!match_Task_Type,
    });

    const areasQuery = useQuery({
        queryKey: ['areas'],
        queryFn: mockListAreas,
        enabled: !!match_Area, // Convierte el resultado a booleano
    });

    const workspacesQuery = useQuery({
        queryKey: ['workspaces'],
        queryFn: mockListWorkspaces,
        enabled: !!match_Workspace,
    });

    const seasonsQuery = useQuery({
        queryKey: ['seasons'],
        queryFn: mockListSeasons,
        enabled: !!match_Season,
    });

    const farmsQuery = useQuery({
        queryKey: ['farms'],
        queryFn: mockListFarms,
        enabled: !!match_Farm,
    });

    const fieldsQuery = useQuery({
        queryKey: ['fields'],
        queryFn: mockListFields,
        enabled: !!match_Field,
    });

    const collectFormsQuery = useQuery({
        queryKey: ['collectForms'],
        queryFn: mockListProjects,
        enabled: !!match_Collect_Form,
    });


    return (
        <div className="space-y-4">
            {match_Scope && (
                <div>
                    <Label htmlFor="selectedScope">Scope</Label>
                    <Select {...methods.register('selectedScope')}>
                        <SelectTrigger>
                            <SelectValue placeholder="Selecciona una opción" />
                        </SelectTrigger>
                        <SelectContent>
                            {scopesQuery.data?.map((scope: any) => (
                                <SelectItem key={scope.id} value={scope.id}>{scope.name}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            )}

            {match_Task_Type && (
                <div>
                    <Label htmlFor="selectedTaskType">Type</Label>
                    <Select {...methods.register('selectedTaskType')}>
                        <SelectTrigger>
                            <SelectValue placeholder="Selecciona una opción" />
                        </SelectTrigger>
                        <SelectContent>
                            {taskTypesQuery.data?.map((taskType: any) => (
                                <SelectItem key={taskType.id} value={taskType.id}>{taskType.name}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            )}

            {match_Area && (
                <div>
                    <Label htmlFor="selectedArea">Area</Label>
                    <Select {...methods.register('selectedArea')}>
                        <SelectTrigger>
                            <SelectValue placeholder="Selecciona una opción" />
                        </SelectTrigger>
                        <SelectContent>
                            {areasQuery.data?.map((area: any) => (
                                <SelectItem key={area.id} value={area.id}>{area.name}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            )}

            {match_Workspace && (
                <div>
                    <Label htmlFor="selectedWorkspace">Workspace</Label>
                    <Select {...methods.register('selectedWorkspace')}>
                        <SelectTrigger>
                            <SelectValue placeholder="Selecciona una opción" />
                        </SelectTrigger>
                        <SelectContent>
                            {workspacesQuery.data?.map((workspace: any) => (
                                <SelectItem key={workspace.id} value={workspace.id}>{workspace.name}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            )}

            {match_Season && (
                <div>
                    <Label htmlFor="selectedSeason">Season</Label>
                    <Select {...methods.register('selectedSeason')}>
                        <SelectTrigger>
                            <SelectValue placeholder="Selecciona una opción" />
                        </SelectTrigger>
                        <SelectContent>
                            {seasonsQuery.data?.map((season: any) => (
                                <SelectItem key={season.id} value={season.id}>{season.name}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            )}

            {match_Farm && (
                <div>
                    <Label htmlFor="selectedFarm">Farm</Label>
                    <Select {...methods.register('selectedFarm')}>
                        <SelectTrigger>
                            <SelectValue placeholder="Selecciona una opción" />
                        </SelectTrigger>
                        <SelectContent>
                            {farmsQuery.data?.map((farm: any) => (
                                <SelectItem key={farm.id} value={farm.id}>{farm.name}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            )}

            {match_Field && (
                <div>
                    <Label htmlFor="selectedField">Field</Label>
                    <Select {...methods.register('selectedField')}>
                        <SelectTrigger>
                            <SelectValue placeholder="Selecciona una opción" />
                        </SelectTrigger>
                        <SelectContent>
                            {fieldsQuery.data?.map((field: any) => (
                                <SelectItem key={field.id} value={field.id}>{field.name}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            )}

            {match_Collect_Form && (
                <div>
                    <Label htmlFor="collectForm">Collect Form</Label>
                    <Select {...methods.register('selectedCollectForm')}>
                        <SelectTrigger>
                            <SelectValue placeholder="Selecciona una opción" />
                        </SelectTrigger>
                        <SelectContent>
                            {collectFormsQuery.data?.map((form: any) => (
                                <SelectItem key={form.id} value={form.id}>{form.name}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            )}

        </div>
    );
}

// Las funciones de mock siguen siendo las mismas como en el ejemplo anterior
const mockListScopes = () => Promise.resolve([
    { id: '1', name: 'Scope 1' },
    { id: '2', name: 'Scope 2' }
]);

const mockListTaskTypes = () => Promise.resolve([
    { id: '1', name: 'Type A' },
    { id: '2', name: 'Type B' }
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
    { id: '1', name: 'Season 1' },
    { id: '2', name: 'Season 2' }
]);

const mockListFarms = () => Promise.resolve([
    { id: '1', name: 'Farm 1' },
    { id: '2', name: 'Farm 2' }
]);

const mockListFields = () => Promise.resolve([
    { id: '1', name: 'Field 1' },
    { id: '2', name: 'Field 2' }
]);

const mockListProjects = () => Promise.resolve([
    { id: '1', name: 'Project 1' },
    { id: '2', name: 'Project 2' }
]);