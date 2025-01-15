'use client'

import React, { useState, useEffect } from 'react';
import * as api360 from '@/lib/360';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

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
  fields?: FormField[];
  addButtonText?: string;
  removeButtonText?: string;
  apiCall?: string; // Solo el nombre de la API
}

// Declara las funciones de API que podrías necesitar
type ApiFunction = (apiCallName: string) => Promise<Option[]>;

interface DynamicFormProps {
  jsonUrl: string;
}

const DynamicForm: React.FC<DynamicFormProps> = ({ jsonUrl }) => {
  const [formData, setFormData] = useState<FormField[]>([]);
  const [formState, setFormState] = useState<Record<string, string | File | any[]>>({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(jsonUrl);
        const data = await response.json();
        setFormData(data);
        // Procesar cada campo del formulario
        for (const field of data) {
          if (field.apiCall) {
            // Buscamos la función en el objeto importado
            const apiFunction = api360[field.apiCall as keyof typeof api360];
            
            if (typeof apiFunction === 'function') {
              const options: Option[] = await apiFunction(field.apiCall);
              setFormData((prevData: FormField[]) => prevData.map((f: FormField) =>
                f.name === field.name ? { ...f, options } : f
              ));
            } else {
              console.error(`La función API '${field.apiCall}' no está definida en el módulo api360`);
            }
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [jsonUrl]);
  
  const handleChange = (name: string, value: string | File, index?: number, subfieldName?: string) => {
    if (subfieldName !== undefined && index !== undefined) {
      setFormState(prevState => {
        const newSubform = Array.isArray(prevState[subfieldName]) ? [...prevState[subfieldName]] : [];
        newSubform[index] = { ...newSubform[index], [name]: value };
        return { ...prevState, [subfieldName]: newSubform };
      });
    } else {
      setFormState(prevState => ({
        ...prevState,
        [name]: value
      }));
    }
  };

  const renderField = (field: FormField, index?: number, subfieldName?: string) => {
    let value;
    let dependsOnValue;

    if (subfieldName !== undefined && index !== undefined) {
      // Verificamos si formState[subfieldName] es un array
      const subformData = Array.isArray(formState[subfieldName]) ? formState[subfieldName] : [];
      value = subformData[index]?.[field.name] || '';
      // Solo intentamos acceder a field.dependsOn si existe
      dependsOnValue = field.dependsOn ? subformData[index]?.[field.dependsOn] : undefined;
    } else {
      value = formState[field.name] || '';
      dependsOnValue = field.dependsOn ? formState[field.dependsOn] : undefined;
    }

    if (field.dependsOn && dependsOnValue !== undefined) {
      if (typeof field.options === 'object' && !Array.isArray(field.options)) {
        const options = field.options[typeof dependsOnValue === 'string' ? dependsOnValue : ''] || [];
        return renderDependentSelect(field, options, index, subfieldName);
      }
    }

    switch (field.type) {
      case 'select':
        return renderSelect(field, index, subfieldName);
      case 'file':
        return renderFileInput(field, index, subfieldName);
      case 'text':
      case 'date':
      case 'email':
        return renderInput(field, index, subfieldName);
      case 'subform':
        return renderSubform(field);
      default:
        return null;
    }
  };

  const renderDependentSelect = (field: FormField, options: Option[], index?: number, subfieldName?: string) => {
    let value;

    if (subfieldName !== undefined && index !== undefined) {
      // Verificamos si formState[subfieldName] es un array
      const subformData = Array.isArray(formState[subfieldName]) ? formState[subfieldName] : [];
      value = subformData[index]?.[field.name] || '';
    } else {
      value = formState[field.name] || '';
    }

    return (
      <div key={field.name} className="mb-4">
        <Label htmlFor={field.name}>{field.label}</Label>
        <Select onValueChange={(newValue) => handleChange(field.name, newValue, index, subfieldName)} value={value as string}>
          <SelectTrigger id={field.name}>
            <SelectValue placeholder={field.label} />
          </SelectTrigger>
          <SelectContent>
            {options.map((option, idx) => (
              <SelectItem key={idx} value={option.value}>{option.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    );
  };

  const renderSelect = (field: FormField, index?: number, subfieldName?: string) => {
    let value;

    if (subfieldName !== undefined && index !== undefined) {
      // Verificamos si formState[subfieldName] es un array
      const subformData = Array.isArray(formState[subfieldName]) ? formState[subfieldName] : [];
      value = subformData[index]?.[field.name] || '';
    } else {
      value = formState[field.name] || '';
    }

    const options = Array.isArray(field.options)
      ? field.options
      : Object.values(field.options || {}).flat();

    return (
      <div key={field.name} className="mb-4">
        <Label htmlFor={field.name}>{field.label}</Label>
        <Select onValueChange={(newValue) => handleChange(field.name, newValue, index, subfieldName)} value={value as string}>
          <SelectTrigger id={field.name}>
            <SelectValue placeholder={field.label} />
          </SelectTrigger>
          <SelectContent>
            {options.map((option, idx) => (
              <SelectItem key={idx} value={option.value}>{option.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    );
  };

  const renderFileInput = (field: FormField, index?: number, subfieldName?: string) => (
    <div key={field.name} className="mb-4">
      <Label htmlFor={field.name}>{field.label}</Label>
      <Input
        type="file"
        id={field.name}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleChange(field.name, file, index, subfieldName);
        }}
      />
    </div>
  );

  const renderInput = (field: FormField, index?: number, subfieldName?: string) => {
    let value;

    if (subfieldName !== undefined && index !== undefined) {
      // Verificamos si formState[subfieldName] es un array
      const subformData = Array.isArray(formState[subfieldName]) ? formState[subfieldName] : [];
      value = subformData[index]?.[field.name] || '';
    } else {
      value = formState[field.name] || '';
    }

    return (
      <div key={field.name} className="mb-4">
        <Label htmlFor={field.name}>{field.label}</Label>
        <Input
          type={field.type}
          id={field.name}
          placeholder={field.placeholder || ''}
          value={value as string}
          onChange={(e) => handleChange(field.name, e.target.value, index, subfieldName)}
        />
      </div>
    );
  };

  const renderSubform = (field: FormField) => {
    // Aseguramos que subformData sea un array, incluso si formState[field.name] no lo es
    const subformData = Array.isArray(formState[field.name]) ? formState[field.name] : [];
    // Forzamos el tipado a any[] usando as any[]
    const typedSubformData = subformData as any[];

    return (
      <div key={field.name} className="mb-4">
        <Label>{field.label}</Label>
        <Table>
          <TableHeader>
            <TableRow>
              {field.fields?.map((subField, index) => (
                <TableHead key={index}>{subField.label}</TableHead>
              ))}
              <TableHead>Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
          {typedSubformData.map((row, rowIndex: number) => (
            <TableRow key={rowIndex}>
              {field.fields?.map((subField, subFieldIndex) => (
                <TableCell key={subFieldIndex}>
                  {renderField(subField, rowIndex, field.name)}
                </TableCell>
              ))}
              <TableCell>
                <Button variant="destructive" size="sm" onClick={() => removeSubformRow(field.name, rowIndex)}>{field.removeButtonText || 'Eliminar'}</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        </Table>
        <Button type="button" onClick={() => addSubformRow(field.name)}>{field.addButtonText || 'Agregar'}</Button>
      </div>
    );
  };

  const addSubformRow = (subfieldName: string) => {
    const initialSubformRow: Record<string, string> = {};
    formData.find(field => field.name === subfieldName)?.fields?.forEach(subField => {
      initialSubformRow[subField.name] = '';
    });
    setFormState(prevState => {
      // Verificamos si prevState[subfieldName] es un array
      const currentSubformData = Array.isArray(prevState[subfieldName]) ? prevState[subfieldName] : [];
      return {
        ...prevState,
        [subfieldName]: [...currentSubformData, initialSubformRow]
      };
    });
  };

  const removeSubformRow = (subfieldName: string, index: number) => {
    setFormState(prevState => {
      // Verificamos si prevState[subfieldName] es un array
      const currentSubformData = Array.isArray(prevState[subfieldName]) ? prevState[subfieldName] : [];
      return {
        ...prevState,
        [subfieldName]: currentSubformData.filter((_: any, i: number) => i !== index)
      };
    });
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