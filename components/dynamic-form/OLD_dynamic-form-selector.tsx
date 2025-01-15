'use client'

import { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import DynamicForm from '@/components/dynamic-form/dynamic-form';

interface DynamicFormSelectorProps {
  jsonFiles: string[];
}

export default function DynamicFormSelector({ jsonFiles }: DynamicFormSelectorProps) {
  const [selectedFile, setSelectedFile] = useState<string | null>(null);

  return (
    <div>
      <Select onValueChange={setSelectedFile}>
        <SelectTrigger className="w-[180px] mb-4">
          <SelectValue placeholder="Select a JSON file" />
        </SelectTrigger>
        <SelectContent>
          {jsonFiles.map((file) => (
            <SelectItem key={file} value={file}>
              {file}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {selectedFile && (
        <DynamicForm jsonUrl={`/data/${selectedFile}`} />
      )}
    </div>
  );
}