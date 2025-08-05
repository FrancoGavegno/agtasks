"use client"

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { useForm, DefaultValues, Path } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from '@/hooks/use-toast'

interface CrudModalProps<T> {
  open: boolean
  onOpenChange: (open: boolean) => void
  mode: 'create' | 'edit'
  title: string
  description: string
  schema: z.ZodSchema<T>
  defaultValues?: Partial<T>
  onSubmit: (data: T) => Promise<void>
  fields: Array<{
    name: keyof T
    label: string
    type: 'text' | 'email' | 'password' | 'textarea' | 'select' | 'switch' | 'number'
    required?: boolean
    options?: Array<{ value: string; label: string }>
    placeholder?: string
  }>
}

export function CrudModal<T extends Record<string, any>>({
  open,
  onOpenChange,
  mode,
  title,
  description,
  schema,
  defaultValues,
  onSubmit,
  fields
}: CrudModalProps<T>) {
  const t = useTranslations('Common')
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<T>({
    resolver: zodResolver(schema),
    defaultValues: (defaultValues || {}) as DefaultValues<T>
  })

  useEffect(() => {
    if (open && defaultValues) {
      form.reset(defaultValues as DefaultValues<T>)
    } else if (open) {
      form.reset()
    }
  }, [open, defaultValues, form])

  const handleSubmit = async (data: T) => {
    try {
      setIsLoading(true)
      await onSubmit(data)
      toast({
        title: t('success'),
        description: mode === 'create' ? t('createdSuccessfully') : t('updatedSuccessfully'),
      })
      onOpenChange(false)
      form.reset()
    } catch (error) {
      toast({
        title: t('error'),
        description: error instanceof Error ? error.message : t('unexpectedError'),
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const renderField = (field: typeof fields[0]) => {
    const { name, type, label, required, options, placeholder } = field

    switch (type) {
      case 'textarea':
        return (
          <FormField
            key={String(name)}
            control={form.control}
            name={name as Path<T>}
            render={({ field }) => (
              <FormItem className="col-span-full">
                <FormLabel>
                  {label}
                  {required && <span className="text-red-500 ml-1">*</span>}
                </FormLabel>
                <FormControl>
                  <Textarea
                    placeholder={placeholder}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )

      case 'select':
        return (
          <FormField
            key={String(name)}
            control={form.control}
            name={name as Path<T>}
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {label}
                  {required && <span className="text-red-500 ml-1">*</span>}
                </FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={placeholder || t('select')} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {options?.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        )

      case 'switch':
        return (
          <FormField
            key={String(name)}
            control={form.control}
            name={name as Path<T>}
            render={({ field }) => (
              <FormItem className="col-span-full flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">
                    {label}
                    {required && <span className="text-red-500 ml-1">*</span>}
                  </FormLabel>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        )

      case 'number':
        return (
          <FormField
            key={String(name)}
            control={form.control}
            name={name as Path<T>}
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {label}
                  {required && <span className="text-red-500 ml-1">*</span>}
                </FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder={placeholder}
                    {...field}
                    onChange={(e) => field.onChange(e.target.valueAsNumber)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )

      default:
        return (
          <FormField
            key={String(name)}
            control={form.control}
            name={name as Path<T>}
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {label}
                  {required && <span className="text-red-500 ml-1">*</span>}
                </FormLabel>
                <FormControl>
                  <Input
                    type={type}
                    placeholder={placeholder}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] h-[95vh] max-w-none max-h-none flex flex-col p-0">
        <DialogHeader className="flex-shrink-0 p-6 pb-4">
          <DialogTitle className="text-xl">{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="flex flex-col h-full">
            <div className="flex-1 overflow-y-auto px-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 py-4">
                {fields.map(renderField)}
              </div>
            </div>
            
            <DialogFooter className="flex-shrink-0 p-6 pt-4 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isLoading}
              >
                {t('cancel')}
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? t('loading') : mode === 'create' ? t('create') : t('update')}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
} 