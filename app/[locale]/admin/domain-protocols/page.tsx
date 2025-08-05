"use client"

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { ColumnDef } from '@tanstack/react-table'
import { Edit, Trash2, Plus, Eye, EyeOff } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ConfirmDeleteDialog } from '@/components/ui/confirm-delete-dialog'
import { DataTable } from '@/components/admin/data-table'
import { AdminLayout } from '@/components/admin/admin-layout'
import { CrudModal } from '@/components/admin/crud-modal'
import { apiClient } from '@/lib/integrations/amplify'
import { domainProtocolSchema, type DomainProtocol } from '@/lib/schemas'
import { toast } from '@/hooks/use-toast'

export default function DomainProtocolsPage() {
  const t = useTranslations('Admin.DomainProtocols')
  const commonT = useTranslations('Common')
  
  const [data, setData] = useState<DomainProtocol[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create')
  const [selectedItem, setSelectedItem] = useState<DomainProtocol | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [itemToDelete, setItemToDelete] = useState<DomainProtocol | null>(null)

  // Load data
  const loadData = async () => {
    try {
      setLoading(true)
      const result = await apiClient.listDomainProtocols()
      setData(result.items)
    } catch (error) {
      toast({
        title: commonT('error'),
        description: error instanceof Error ? error.message : commonT('unexpectedError'),
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  // Handle create
  const handleCreate = async (formData: any) => {
    await apiClient.createDomainProtocol(formData)
    await loadData()
  }

  // Handle update
  const handleUpdate = async (formData: any) => {
    if (!selectedItem?.id) return
    await apiClient.updateDomainProtocol(selectedItem.id, formData)
    await loadData()
  }

  // Handle delete
  const handleDelete = async () => {
    if (!itemToDelete?.id) return
    try {
      await apiClient.deleteDomainProtocol(itemToDelete.id)
      await loadData()
      toast({
        title: commonT('success'),
        description: commonT('deletedSuccessfully'),
      })
    } catch (error) {
      toast({
        title: commonT('error'),
        description: error instanceof Error ? error.message : commonT('unexpectedError'),
        variant: 'destructive',
      })
    } finally {
      setDeleteDialogOpen(false)
      setItemToDelete(null)
    }
  }

  // Table columns
  const columns: ColumnDef<DomainProtocol>[] = [
    {
      accessorKey: 'name',
      header: t('columns.name'),
    },
    {
      accessorKey: 'domainId',
      header: t('columns.domainId'),
    },
    {
      accessorKey: 'tmProtocolId',
      header: t('columns.tmProtocolId'),
    },
    {
      accessorKey: 'language',
      header: t('columns.language'),
      cell: ({ row }) => (
        <Badge variant="secondary">
          {row.getValue('language')}
        </Badge>
      ),
    },
    {
      accessorKey: 'createdAt',
      header: t('columns.createdAt'),
      cell: ({ row }) => new Date(row.getValue('createdAt')).toLocaleDateString(),
    },
    {
      id: 'actions',
      header: commonT('actions'),
      cell: ({ row }) => {
        const item = row.original
        return (
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSelectedItem(item)
                setModalMode('edit')
                setModalOpen(true)
              }}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setItemToDelete(item)
                setDeleteDialogOpen(true)
              }}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        )
      },
    },
  ]

  const fields = [
    {
      name: 'domainId' as keyof DomainProtocol,
      label: t('form.domainId'),
      type: 'text' as const,
      required: true,
      placeholder: t('form.domainIdPlaceholder'),
    },
    {
      name: 'tmProtocolId' as keyof DomainProtocol,
      label: t('form.tmProtocolId'),
      type: 'text' as const,
      required: true,
      placeholder: t('form.tmProtocolIdPlaceholder'),
    },
    {
      name: 'name' as keyof DomainProtocol,
      label: t('form.name'),
      type: 'text' as const,
      required: true,
      placeholder: t('form.namePlaceholder'),
    },
    {
      name: 'language' as keyof DomainProtocol,
      label: t('form.language'),
      type: 'select' as const,
      required: true,
      options: [
        { value: 'en', label: 'English' },
        { value: 'es', label: 'Español' },
        { value: 'pt', label: 'Português' },
      ],
    },
  ]

  return (
    <AdminLayout
      title={t('title')}
      subtitle={t('subtitle')}
      breadcrumbs={[{ label: t('breadcrumb') }]}
      actions={
        <Button onClick={() => {
          setSelectedItem(null)
          setModalMode('create')
          setModalOpen(true)
        }}>
          <Plus className="h-4 w-4 mr-2" />
          {t('create')}
        </Button>
      }
    >
      <DataTable
        columns={columns}
        data={data}
        searchKey="name"
      />

      <CrudModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        mode={modalMode}
        title={modalMode === 'create' ? t('createTitle') : t('editTitle')}
        description={modalMode === 'create' ? t('createDescription') : t('editDescription')}
        schema={domainProtocolSchema}
        defaultValues={selectedItem || undefined}
        onSubmit={modalMode === 'create' ? handleCreate : handleUpdate}
        fields={fields}
      />

      <ConfirmDeleteDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title={t('deleteTitle')}
        description={t('deleteDescription')}
        onConfirm={handleDelete}
      />
    </AdminLayout>
  )
} 