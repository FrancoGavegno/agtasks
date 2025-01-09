import { UseFormReturn } from 'react-hook-form';
import { FormData } from '@/components/stepper/types';

type Step4Props = {
    methods: UseFormReturn<FormData>;
};

export default function Step4({ methods }: Step4Props) {
    const formData = methods.watch();

    return (


        <div className="space-y-4">
            <h3 className="text-lg font-semibold">Project Summary</h3>
            <p><strong>Name:</strong> {formData.name}</p>

            <p><strong>Description:</strong> {formData.description}</p>

            <p><strong>Field Matching:</strong></p>
            <ul>
                {Object.entries(formData).filter(([key]) => key.startsWith('match_')).map(([key, value]) => (
                    <li key={key}><strong>{key.replace('match_', '')}:</strong> {value as string}</li>
                ))}
            </ul>

            <p><strong>Selected Artifacts:</strong></p>
            <ul>
                {Object.entries(formData).filter(([key]) => key.startsWith('selected')).map(([key, value]) => (
                    <li key={key}><strong>{key.replace('selected', '')}:</strong> {value as string}</li>
                ))}
            </ul>
            
            <p><strong>Object Representation:</strong></p>
            <pre>{JSON.stringify(formData, null, 2)}</pre>

        </div>
    );
}