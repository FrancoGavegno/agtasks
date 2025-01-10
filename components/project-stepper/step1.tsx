import { UseFormReturn } from 'react-hook-form';
import { FormData } from '@/components/project-stepper/types';
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { SquareArrowOutUpRight } from 'lucide-react';

type Step1Props = {
    methods: UseFormReturn<FormData>;
};

export default function Step1({ methods }: Step1Props) {

    return (
        <div className="space-y-4">
            <p className="text-sm text-slate-700">Este será el proyecto cuya información editará en de ClickUp.</p>
            <div>
                <Label htmlFor="name">Name</Label>
                <Input
                    id="name"
                    disabled
                    {...methods.register('name')}
                    placeholder="Ambientación con mapa de productividad (DEMO)" />
            </div>
            <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                    id="description"
                    disabled
                    {...methods.register('description')}
                    placeholder="Esta es una descripción de prueba" />
            </div>
            <div>
                <Label htmlFor="url">URL proyecto</Label>
                <div className="flex w-full items-center space-x-2">
                    <Input
                        id="url"
                        disabled
                        placeholder="https://app.clickup.com/9011455509/v/li/901108172278"
                    />
                    <Button asChild>
                        <Link href="https://app.clickup.com/9011455509/v/li/901108172278" target="_blank">
                        <SquareArrowOutUpRight />
                        </Link>
                    </Button>
                </div>
            </div>
        </div>
    );
}