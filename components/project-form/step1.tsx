import { useEffect, useState } from 'react';
import { Link } from '@/i18n/routing';
import { UseFormReturn } from 'react-hook-form';
import { FormData } from '@/lib/types';
import { getList } from '@/lib/clickup';
import { Project } from "@/lib/interfaces";
import { Button } from '@/components/ui/button';
import { Input } from "@/components/ui/input"
import { Label } from '@/components/ui/label';
import { Textarea } from "@/components/ui/textarea";
import { SquareArrowOutUpRight } from 'lucide-react';

type Step1Props = {
    methods: UseFormReturn<FormData>;
};

export default function Step1({ methods }: Step1Props) {
    const [project, setProject] = useState<Project>({
        id: 0,
        name: '',
        description: '',
        taskCount: 0,
        space: '',
        tags: [],
        progress: 0,
        dueDate: '',
        status: '',
        team: [{ name: '', image: '' }]
    });

    // obtener información de la tarea consultando la API???
    useEffect(() => {
        getList("901108557658")
            .then((data) => {
                setProject(data);
            })
            .catch((error) => {
                console.error('Error fetching list:', error);
            });
    }, []);

    return (
        <div className="space-y-4">
            <p className="text-sm text-slate-700">Este será el proyecto cuya información editará en de ClickUp.</p>
            <div>
                <Label htmlFor="name">Name</Label>
                <Input
                    id="name"
                    disabled
                    {...methods.register('name')}
                    placeholder={project.name} />
            </div>
            <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                    id="description"
                    disabled
                    {...methods.register('description')}
                    placeholder={project.description} />
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