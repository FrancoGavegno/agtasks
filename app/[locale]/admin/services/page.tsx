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
import { serviceSchema, type Service } from '@/lib/schemas'
import { toast } from '@/hooks/use-toast'

// Type for Service with required id (from API responses)
type ServiceWithId = Service & {
  id: string
  createdAt: string
  updatedAt: string
}

export default function ServicesPage() {
  const t = useTranslations('Admin.Services')
  const commonT = useTranslations('Common')
  
  const [data, setData] = useState<ServiceWithId[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create')
  const [selectedItem, setSelectedItem] = useState<ServiceWithId | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [itemToDelete, setItemToDelete] = useState<ServiceWithId | null>(null)
  const [showDeleted, setShowDeleted] = useState(false)

  // Load data
  const loadData = async () => {
    try {
      setLoading(true)
      const result = await apiClient.listServices({ deleted: showDeleted, limit: 20 })
      setData(result.items as ServiceWithId[])
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
  }, [showDeleted])

  // Handle create
  const handleCreate = async (formData: any) => {
    await apiClient.createService(formData)
    await loadData()
  }

  // Handle update
  const handleUpdate = async (formData: any) => {
    if (!selectedItem) return
    await apiClient.updateService(selectedItem.id, formData)
    await loadData()
  }

  // Handle soft delete
  const handleSoftDelete = async () => {
    if (!itemToDelete) return
    try {
      await apiClient.updateService(itemToDelete.id, { deleted: true })
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

  // Handle restore
  const handleRestore = async (service: ServiceWithId) => {
    try {
      await apiClient.updateService(service.id, { deleted: false })
      await loadData()
      toast({
        title: commonT('success'),
        description: t('restoredSuccessfully'),
      })
    } catch (error) {
      toast({
        title: commonT('error'),
        description: error instanceof Error ? error.message : commonT('unexpectedError'),
        variant: 'destructive',
      })
    }
  }

  // Table columns
  const columns: ColumnDef<ServiceWithId>[] = [
    {
      accessorKey: 'name',
      header: t('columns.name'),
    },
    {
      accessorKey: 'projectId',
      header: t('columns.projectId'),
    },
    {
      accessorKey: 'tmpRequestId',
      header: t('columns.tmpRequestId'),
      cell: ({ row }) => {
        const value = row.getValue('tmpRequestId')
        return value || '-'
      },
    },
    {
      accessorKey: 'requestId',
      header: t('columns.requestId'),
      cell: ({ row }) => {
        const value = row.getValue('requestId')
        return value || '-'
      },
    },
    {
      accessorKey: 'protocolId',
      header: t('columns.protocolId'),
      cell: ({ row }) => {
        const value = row.getValue('protocolId')
        return value || '-'
      },
    },
    {
      accessorKey: 'deleted',
      header: t('columns.status'),
      cell: ({ row }) => {
        const deleted = row.getValue('deleted')
        return deleted ? (
          <Badge variant="destructive">{t('deleted')}</Badge>
        ) : (
          <Badge variant="default">{t('active')}</Badge>
        )
      },
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
            {!item.deleted ? (
              <>
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
              </>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleRestore(item)}
              >
                <Eye className="h-4 w-4" />
              </Button>
            )}
          </div>
        )
      },
    },
  ]

  const fields = [
    {
      name: 'projectId' as keyof Service,
      label: t('form.projectId'),
      type: 'text' as const,
      required: true,
      placeholder: t('form.projectIdPlaceholder'),
    },
    {
      name: 'name' as keyof Service,
      label: t('form.name'),
      type: 'text' as const,
      required: true,
      placeholder: t('form.namePlaceholder'),
    },
    {
      name: 'tmpRequestId' as keyof Service,
      label: t('form.tmpRequestId'),
      type: 'text' as const,
      required: false,
      placeholder: t('form.tmpRequestIdPlaceholder'),
    },
    {
      name: 'requestId' as keyof Service,
      label: t('form.requestId'),
      type: 'text' as const,
      required: false,
      placeholder: t('form.requestIdPlaceholder'),
    },
    {
      name: 'protocolId' as keyof Service,
      label: t('form.protocolId'),
      type: 'text' as const,
      required: false,
      placeholder: t('form.protocolIdPlaceholder'),
    },
  ]

  return (
    <AdminLayout
      title={t('title')}
      subtitle={t('subtitle')}
      breadcrumbs={[{ label: t('breadcrumb') }]}
      actions={
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            onClick={() => setShowDeleted(!showDeleted)}
          >
            {showDeleted ? <EyeOff className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
            {showDeleted ? t('showActive') : t('showDeleted')}
          </Button>
          {!showDeleted && (
            <Button onClick={() => {
              setSelectedItem(null)
              setModalMode('create')
              setModalOpen(true)
            }}>
              <Plus className="h-4 w-4 mr-2" />
              {t('create')}
            </Button>
          )}
        </div>
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
        schema={serviceSchema}
        defaultValues={selectedItem || undefined}
        onSubmit={modalMode === 'create' ? handleCreate : handleUpdate}
        fields={fields}
      />

      <ConfirmDeleteDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title={t('deleteTitle')}
        description={t('deleteDescription')}
        onConfirm={handleSoftDelete}
      />
    </AdminLayout>
  )
} 