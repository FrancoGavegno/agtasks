import { UseFormReturn } from 'react-hook-form';
import { FormData } from '@/lib/types';

type Step4Props = {
    methods: UseFormReturn<FormData>;
};

export default function Step4({ methods }: Step4Props) {
    const formData = methods.watch();

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

            {/* <p><strong>Object Representation:</strong></p>
            <pre>{JSON.stringify(formData, null, 2)}</pre> */}
        </div>
    );
}