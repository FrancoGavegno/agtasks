import { useEffect } from 'react';
import { Link } from '@/i18n/routing';
import { UseFormReturn } from 'react-hook-form';
import { FormData } from '@/lib/types';
import { getListCustomFields } from '@/lib/clickup';
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
    // Estos custom fields deben ser obtenidos del List vía API
    const customFields = ['Scope', 'Task_Type', 'Area', 'Workspace', 'Season', 'Farm', 'Field', 'Collect_Form'];
    
    useEffect(() => {
          getListCustomFields("901108557658")
            .then();
      }, []);

    // Estos artefactos podemos setearlos por el momento desde acá 
    const artifacts = ['Scope', 'Task_Type', 'Area', 'Workspace', 'Season', 'Farm', 'Field', 'Collect_Form'];

    return (
        <div className="space-y-4">
            <p className="text-sm text-slate-400">Indique qué artefactos asociará a cada campo custom de su proyecto. Para más información visite <Link href="#" className="text-blue-700 underline">Asociando artefactos a campos custom de mi proyecto</Link>.</p>
            {customFields.map(field => (
                <div key={field}>
                    <Label htmlFor={field}>{field}</Label>
                    <Select 
                        onValueChange={(value) => methods.setValue(`match_${field}`, value)}
                        defaultValue={methods.watch(`match_${field}`) || undefined} 
                    >
                        <SelectTrigger id={field}>
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