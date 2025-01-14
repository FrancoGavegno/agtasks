import { getJsonFiles } from '@/components/dynamic-form/get-json-files';
import DynamicFormSelector from '@/components/dynamic-form/dynamic-form-selector';

export default function Page() {
  const jsonFiles = getJsonFiles();

  return (
    <main className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Formulario Dinámico</h1>
      <DynamicFormSelector jsonFiles={jsonFiles} />
    </main>
  );
}