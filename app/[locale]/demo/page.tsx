"use client";

import React, { useEffect, useState } from "react";
import Form from "@rjsf/core";
import { RJSFSchema, ArrayFieldTemplateProps, UiSchema } from "@rjsf/utils";
import validator from "@rjsf/validator-ajv8";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function DemoPage() {
  const [options, setOptions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const data = ["op 1", "op 2"];
        setOptions(data);
      } catch (e) {
        console.error("Error al cargar opciones:", e);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOptions();
  }, []);

  if (isLoading) return <p className="p-4">Cargando formulario…</p>;

  const schema: RJSFSchema = {
    type: "object",
    properties: {
      tipo: {
        type: "string",
        title: "Tipo",
        enum: ["Aplicación", "Cosecha", "Siembra"],
      },
      responsable: {
        type: "string",
        title: "Responsable",
        enum: ["usuario1@gmail.com", "usuario2@gmail.com", "usuario3@gmail.com"],
      },
      contratista: {
        type: "string",
        title: "Contratista",
        enum: ["usuario1@gmail.com", "usuario2@gmail.com", "usuario3@gmail.com"],
      },
      comoLlegar: {
        type: "string",
        title: "Como llegar",
        format: "uri",
      },
      mapaDeFondo: {
        type: "string",
        title: "Mapa de fondo",
        format: "uri",
      },
      insumos: {
        type: "array",
        title: "Insumos",
        items: {
          type: "object",
          properties: {
            insumo: {
              type: "string",
              title: "Insumo",
              enum: ["Insumo 1", "Insumo 2"],
            },
            dosis: {
              type: "number",
              title: "Dosis",
              minimum: 0,
            },
            unidad: {
              type: "string",
              title: "Unidad",
              enum: ["Kg/Ha", "Lt/Ha"],
            },
            hectareas: {
              type: "number",
              title: "Hectáreas",
              minimum: 0,
            },
          },
          required: ["insumo", "dosis", "unidad", "hectareas"],
        },
      },
    },
    required: [
      "tipo",
      "responsable",
      "contratista",
      "comoLlegar",
      "mapaDeFondo",
      "insumos",
    ],
  };

  const uiSchema: UiSchema = {
    tipo: {
      "ui:widget": (props: any) => (
        <div className="mb-4">
          <Label>{props.label}</Label>
          <Select onValueChange={props.onChange} value={props.value || ""}>
            <SelectTrigger>
              <SelectValue placeholder="Seleccione un tipo" />
            </SelectTrigger>
            <SelectContent>
              {props.options.enumOptions.map((opt: any) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      ),
    },
    responsable: {
      "ui:widget": "select",
      "ui:classNames": "mb-4",
    },
    contratista: {
      "ui:widget": "select",
      "ui:classNames": "mb-4",
    },
    comoLlegar: {
      "ui:widget": (props: any) => (
        <div className="mb-4">
          <Label>{props.label}</Label>
          <Input type="url" value={props.value || ""} onChange={(e) => props.onChange(e.target.value)} />
        </div>
      ),
    },
    mapaDeFondo: {
      "ui:widget": (props: any) => (
        <div className="mb-4">
          <Label>{props.label}</Label>
          <Input type="url" value={props.value || ""} onChange={(e) => props.onChange(e.target.value)} />
        </div>
      ),
    },
  };

  const ArrayFieldTemplate = (props: ArrayFieldTemplateProps) => {
    const itemsSchema = props.schema.items;
    const schemaProps =
      typeof itemsSchema === "object" && !Array.isArray(itemsSchema) && itemsSchema.type === "object"
        ? itemsSchema.properties || {}
        : {};

    const fieldKeys = Object.keys(schemaProps);

    return (
      <div className="space-y-4">
        {props.title && <h3 className="text-lg font-semibold">{props.title}</h3>}

        <Table className="border rounded-md">
          <TableHeader>
            <TableRow>
              {fieldKeys.map((key) => (
                <TableHead key={key}>{(schemaProps[key] as any)?.title || key}</TableHead>
              ))}
              <TableHead>Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {props.items.map((item, rowIndex) => {
              const rawChildren = item.children?.props?.children;
              const fieldArray = Array.isArray(rawChildren)
                ? rawChildren
                : typeof rawChildren === "object" && rawChildren !== null
                ? [rawChildren]
                : [];

              return (
                <TableRow key={item.key}>
                  {fieldArray.length > 0 ? (
                    <>
                      {fieldArray.map((field: any, colIndex: number) => (
                        <TableCell key={colIndex} className="align-top p-2">
                          {field}
                        </TableCell>
                      ))}
                      <TableCell className="align-top p-2 text-right">
                        {item.hasRemove && (
                          <Button
                            variant="destructive"
                            type="button"
                            onClick={item.onDropIndexClick(rowIndex)}
                          >
                            Eliminar
                          </Button>
                        )}
                      </TableCell>
                    </>
                  ) : (
                    <TableCell colSpan={fieldKeys.length + 1}>{item.children}</TableCell>
                  )}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>

        {props.canAdd && (
          <Button type="button" onClick={props.onAddClick} className="mt-2">
            Agregar fila
          </Button>
        )}
      </div>
    );
  };

  const handleSubmit = ({ formData }: any) => {
    console.log("formData:", formData);
  };

  return (
    <main className="p-8">
      <Form
        schema={schema}
        uiSchema={uiSchema}
        templates={{ ArrayFieldTemplate }}
        validator={validator}
        onSubmit={handleSubmit}
      />
    </main>
  );
}
