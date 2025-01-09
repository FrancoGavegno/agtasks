import React, { useState } from 'react';
import { useForm, FormProvider, UseFormReturn } from 'react-hook-form';
import { useQuery } from '@tanstack/react-query';
import { FormData } from '@/components/stepper/types';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
// Asegúrate de importar los componentes de UI correctamente
import Step1 from '@/components/stepper/step1';
import Step2 from '@/components/stepper/step2';
import Step3 from '@/components/stepper/step3';
import Step4 from '@/components/stepper/step4';


export default function ProjectForm({ projectId }: { projectId: string }) {
  const methods = useForm<FormData>();
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    { title: 'Información Básica', content: <Step1 methods={methods as UseFormReturn<FormData>} /> },
    { title: 'Asociación de Campos', content: <Step2 methods={methods as UseFormReturn<FormData>} /> },
    { title: 'Selección de Artefactos', content: <Step3 methods={methods as UseFormReturn<FormData>} projectId={projectId} /> },
    { title: 'Revisión', content: <Step4 methods={methods as UseFormReturn<FormData>} /> },
  ];

  return (
    <FormProvider {...methods}>
      <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Edit Project</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="p-6"> 
          <h2 className="mb-4">{steps[currentStep].title}</h2>
          {steps[currentStep].content}
        </div>
        <div className="flex justify-between p-6"> 
          <Button 
            onClick={() => setCurrentStep(Math.max(0, currentStep - 1))} 
            disabled={currentStep === 0}
          >
            Atrás
          </Button>
          <Button 
            onClick={() => {
              if (currentStep < steps.length - 1) {
                setCurrentStep(currentStep + 1)
              } else {
                methods.handleSubmit(onSubmit)();
              }
            }}
          >
            {currentStep === steps.length - 1 ? 'Confirmar' : 'Siguiente'}
          </Button>
        </div>
        </CardContent>
      </Card>
    </FormProvider>
  );


  function onSubmit(data: FormData) {
    console.log('Form data:', data);
    // Aquí podrías enviar los datos al backend
  }
}