import { UseFormReturn } from 'react-hook-form';
import { FormData } from '@/components/stepper/types';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

type Step2Props = {
    methods: UseFormReturn<FormData>;
};

export default function Step2({ methods }: Step2Props) {
    const customFields = ['Scope', 'Task_Type', 'Area', 'Workspace', 'Season', 'Farm', 'Field', 'Collect_Form'];
    const artifacts = ['Scope', 'Task_Type', 'Area', 'Workspace', 'Season', 'Farm', 'Field', 'Collect_Form'];

    return (
        <div className="space-y-4">
            {customFields.map(field => (
                <div key={field}>
                    <Label htmlFor={field}>{field}</Label>
                    <Select 
                        onValueChange={(value) => methods.setValue(`match_${field}`, value)}
                        defaultValue={methods.watch(`match_${field}`) || undefined} 
                    >
                        <SelectTrigger id={field}>
                            <SelectValue placeholder="Select an artifact" />
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