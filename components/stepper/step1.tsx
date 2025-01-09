import { UseFormReturn } from 'react-hook-form';
import { FormData } from '@/components/stepper/types';
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from '@/components/ui/label';

type Step1Props = {
    methods: UseFormReturn<FormData>;
};

export default function Step1({ methods }: Step1Props) {
    return (
        <div className="space-y-4">
            <div>
                <Label htmlFor="name">Name</Label>
                <Input
                    id="name"
                    {...methods.register('name')}
                    placeholder="Nombre" />
            </div>
            <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                    id="description"
                    {...methods.register('description')}
                    placeholder="Descripción" />
            </div>
        </div>
    );
}