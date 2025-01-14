'use client'

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

interface Option {
  value: string;
  label: string;
}

interface FormField {
  type: string;
  label: string;
  name: string;
  options?: Option[] | { [key: string]: Option[] };
  dependsOn?: string;
  placeholder?: string;
}

interface DynamicFormProps {
  jsonUrl: string;
}

const DynamicForm: React.FC<DynamicFormProps> = ({ jsonUrl }) => {
  const [formData, setFormData] = useState<FormField[]>([]);
  const [formState, setFormState] = useState<Record<string, string | File>>({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(jsonUrl);
        const data = await response.json();
        setFormData(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [jsonUrl]);

  const handleChange = (name: string, value: string | File) => {
    setFormState(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const renderField = (field: FormField) => {
    const value = formState[field.name] || '';
    
    if (field.dependsOn) {
      const dependsOnValue = formState[field.dependsOn];
      if (dependsOnValue && typeof field.options === 'object' && !Array.isArray(field.options)) {
        const options = field.options[typeof dependsOnValue === 'string' ? dependsOnValue : ''] || [];
        return renderDependentSelect(field, options);
      }
    }

    switch (field.type) {
      case 'select':
        return renderSelect(field);
      case 'file':
        return renderFileInput(field);
      case 'text':
      case 'date':
      case 'email':
        return renderInput(field);
      default:
        return null;
    }
  };

  const renderDependentSelect = (field: FormField, options: Option[]) => {
    return (
      <div key={field.name} className="mb-4">
        <Label htmlFor={field.name}>{field.label}</Label>
        <Select onValueChange={(value) => handleChange(field.name, value)} value={formState[field.name] as string}>
          <SelectTrigger id={field.name}>
            <SelectValue placeholder={field.label} />
          </SelectTrigger>
          <SelectContent>
            {options.map((option, index) => (
              <SelectItem key={index} value={option.value}>{option.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    );
  };

  const renderSelect = (field: FormField) => {
  const options = Array.isArray(field.options) 
    ? field.options 
    : Object.values(field.options || {}).flat();

  return (
    <div key={field.name} className="mb-4">
      <Label htmlFor={field.name}>{field.label}</Label>
      <Select onValueChange={(value) => handleChange(field.name, value)} value={formState[field.name] as string}>
        <SelectTrigger id={field.name}>
          <SelectValue placeholder={field.label} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option, index) => (
            <SelectItem key={index} value={option.value}>{option.label}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

  const renderFileInput = (field: FormField) => (
    <div key={field.name} className="mb-4">
      <Label htmlFor={field.name}>{field.label}</Label>
      <Input 
        type="file" 
        id={field.name} 
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleChange(field.name, file);
        }}
      />
    </div>
  );

  const renderInput = (field: FormField) => {
    return (
      <div key={field.name} className="mb-4">
        <Label htmlFor={field.name}>{field.label}</Label>
        <Input 
          type={field.type} 
          id={field.name} 
          placeholder={field.placeholder || ''}
          value={formState[field.name] as string}
          onChange={(e) => handleChange(field.name, e.target.value)}
        />
      </div>
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(formState);
    // Aquí puedes manejar el envío del formulario
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Formulario Dinámico</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent>
          {formData.map(field => renderField(field))}
        </CardContent>
        <CardFooter>
          <Button type="submit">Enviar</Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default DynamicForm;

