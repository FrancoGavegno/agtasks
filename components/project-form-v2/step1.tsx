import { useEffect} from 'react';
import { useParams } from 'next/navigation';
import { Link } from '@/i18n/routing';
import { UseFormReturn } from 'react-hook-form';
import { FormData } from '@/lib/types';
import { getList } from '@/lib/clickup';
import { Project } from "@/lib/interfaces";
import { Button } from '@/components/ui/button';
import { Input } from "@/components/ui/input"
import { Label } from '@/components/ui/label';
import { SquareArrowOutUpRight } from 'lucide-react';

type Step1Props = {
    methods: UseFormReturn<FormData>;
};

export default function Step1({ methods }: Step1Props) {
    const teamId = process.env.NEXT_PUBLIC_TEAM_ID;
    
    const params = useParams();
    const projectId = params.id as string;

     // Obtener información del proyecto consultando la API de ClickUp
    useEffect(() => {
        getList(projectId)
            .then((data: Project) => {
                methods.setValue('name', data.name);
            })
            .catch((error) => {
                console.error('Error fetching list:', error);
            });
    }, [methods]);

    return (
        <div className="space-y-4">
            {/* <p className="text-sm text-slate-700">Este será el proyecto cuya información editarás.</p> */}
            <div>
                <Label htmlFor="name">Name</Label>
                <Input
                    id="name"
                    disabled
                    {...methods.register('name')}
                    defaultValue="Cargando..."
                    // value={nameValue}
                />
            </div>
            <div>
                <Label htmlFor="url">URL proyecto</Label>
                <div className="flex w-full items-center space-x-2">
                    <Input
                        id="url"
                        disabled
                        defaultValue={`https://app.clickup.com/${teamId}/v/li/${projectId}`}
                    />
                    <Button asChild>
                        <Link href={`https://app.clickup.com/${teamId}/v/li/${projectId}`} target="_blank">
                            <SquareArrowOutUpRight />
                        </Link>
                    </Button>
                </div>
            </div>
        </div>
    );
}