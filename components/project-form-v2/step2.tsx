import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Link } from '@/i18n/routing';
import { UseFormReturn } from 'react-hook-form';
import { FormData } from '@/lib/types';
import { getListCustomFields } from '@/lib/clickup';
import { Field } from "@/lib/interfaces";
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select';

type Step2Props = {
    methods: UseFormReturn<FormData>;
};

export default function Step2({ methods }: Step2Props) {
    // const customFields = ['Scope', 'Task_Type', 'Area', 'Workspace', 'Season', 'Farm', 'Field', 'Collect_Form'];

    const params = useParams();
    const projectId = params.id as string;

    const [customFields, setCustomFields] = useState<Field[]>([]);

    useEffect(() => {
        getListCustomFields(projectId)
            .then((response) => {
                // Asignamos los campos personalizados obtenidos de la API al estado
                setCustomFields(response.fields);
            })
            .catch((error) => {
                console.error('Error fetching custom fields:', error);
            });
    }, [projectId]);

    // Estos artefactos podemos setearlos por el momento desde acá 
    const artifacts = ['Scope', 'Task_Type', 'Area', 'Workspace', 'Season', 'Farm', 'Field', 'Collect_Form'];

    return (
        <div className="space-y-4">
            <p className="text-sm text-slate-400">Indique qué artefactos asociará a cada campo custom de su proyecto. Para más información visite <Link href="#" className="text-blue-700 underline">Asociando artefactos a campos custom de mi proyecto</Link>.</p>
            {customFields.map(field => (
                <div key={field.id}>
                    <Label htmlFor={`match_${field.id}`}>{field.name}</Label>
                    <Select
                        onValueChange={(value) => methods.setValue(`match_${field.name.replace(/\s/g, '_')}`, value)}
                        defaultValue={methods.watch(`match_${field.name.replace(/\s/g, '_')}`) || undefined}
                    >
                        <SelectTrigger id={`match_${field.id}`}>
                            <SelectValue placeholder="..." />
                        </SelectTrigger>
                        <SelectContent>
                            {artifacts.map((artifact) => (
                                <SelectItem key={artifact} value={artifact}>
                                    {artifact}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            ))}
        </div>
    );
}