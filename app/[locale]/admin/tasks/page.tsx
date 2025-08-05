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
import { taskSchema, type Task } from '@/lib/schemas'
import { toast } from '@/hooks/use-toast'

// Type for Task with required id (from API responses)
type TaskWithId = Task & {
  id: string
  createdAt: string
  updatedAt: string
}

export default function TasksPage() {
  const t = useTranslations('Admin.Tasks')
  const commonT = useTranslations('Common')
  
  const [data, setData] = useState<TaskWithId[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create')
  const [selectedItem, setSelectedItem] = useState<TaskWithId | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [itemToDelete, setItemToDelete] = useState<TaskWithId | null>(null)
  const [showDeleted, setShowDeleted] = useState(false)

  // Load data
  const loadData = async () => {
    try {
      setLoading(true)
      const result = await apiClient.listTasks({ deleted: showDeleted, limit: 20 })
      setData(result.items as TaskWithId[])
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
    await apiClient.createTask(formData)
    await loadData()
  }

  // Handle update
  const handleUpdate = async (formData: any) => {
    if (!selectedItem) return
    await apiClient.updateTask(selectedItem.id, formData)
    await loadData()
  }

  // Handle soft delete
  const handleSoftDelete = async () => {
    if (!itemToDelete) return
    try {
      await apiClient.updateTask(itemToDelete.id, { deleted: true })
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
  const handleRestore = async (task: TaskWithId) => {
    try {
      await apiClient.updateTask(task.id, { deleted: false })
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
  const columns: ColumnDef<TaskWithId>[] = [
    {
      accessorKey: 'taskName',
      header: t('columns.taskName'),
    },
    {
      accessorKey: 'taskType',
      header: t('columns.taskType'),
      cell: ({ row }) => (
        <Badge variant="outline">
          {row.getValue('taskType')}
        </Badge>
      ),
    },
    {
      accessorKey: 'userEmail',
      header: t('columns.userEmail'),
    },
    {
      accessorKey: 'projectId',
      header: t('columns.projectId'),
      cell: ({ row }) => {
        const value = row.getValue('projectId')
        return value || '-'
      },
    },
    {
      accessorKey: 'serviceId',
      header: t('columns.serviceId'),
      cell: ({ row }) => {
        const value = row.getValue('serviceId')
        return value || '-'
      },
    },
    {
      accessorKey: 'workspaceName',
      header: t('columns.workspaceName'),
      cell: ({ row }) => {
        const value = row.getValue('workspaceName')
        return value || '-'
      },
    },
    {
      accessorKey: 'farmName',
      header: t('columns.farmName'),
      cell: ({ row }) => {
        const value = row.getValue('farmName')
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
                    setSelectedItem(item as TaskWithId)
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
                    setItemToDelete(item as TaskWithId)
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
                onClick={() => handleRestore(item as TaskWithId)}
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
      name: 'taskName' as keyof Task,
      label: t('form.taskName'),
      type: 'text' as const,
      required: true,
      placeholder: t('form.taskNamePlaceholder'),
    },
    {
      name: 'taskType' as keyof Task,
      label: t('form.taskType'),
      type: 'text' as const,
      required: true,
      placeholder: t('form.taskTypePlaceholder'),
    },
    {
      name: 'userEmail' as keyof Task,
      label: t('form.userEmail'),
      type: 'email' as const,
      required: true,
      placeholder: t('form.userEmailPlaceholder'),
    },
    {
      name: 'projectId' as keyof Task,
      label: t('form.projectId'),
      type: 'text' as const,
      required: false,
      placeholder: t('form.projectIdPlaceholder'),
    },
    {
      name: 'serviceId' as keyof Task,
      label: t('form.serviceId'),
      type: 'text' as const,
      required: false,
      placeholder: t('form.serviceIdPlaceholder'),
    },
    {
      name: 'workspaceId' as keyof Task,
      label: t('form.workspaceId'),
      type: 'number' as const,
      required: true,
      placeholder: t('form.workspaceIdPlaceholder'),
    },
    {
      name: 'workspaceName' as keyof Task,
      label: t('form.workspaceName'),
      type: 'text' as const,
      required: false,
      placeholder: t('form.workspaceNamePlaceholder'),
    },
    {
      name: 'seasonId' as keyof Task,
      label: t('form.seasonId'),
      type: 'number' as const,
      required: true,
      placeholder: t('form.seasonIdPlaceholder'),
    },
    {
      name: 'seasonName' as keyof Task,
      label: t('form.seasonName'),
      type: 'text' as const,
      required: false,
      placeholder: t('form.seasonNamePlaceholder'),
    },
    {
      name: 'farmId' as keyof Task,
      label: t('form.farmId'),
      type: 'number' as const,
      required: true,
      placeholder: t('form.farmIdPlaceholder'),
    },
    {
      name: 'farmName' as keyof Task,
      label: t('form.farmName'),
      type: 'text' as const,
      required: false,
      placeholder: t('form.farmNamePlaceholder'),
    },
    {
      name: 'formId' as keyof Task,
      label: t('form.formId'),
      type: 'text' as const,
      required: false,
      placeholder: t('form.formIdPlaceholder'),
    },
    {
      name: 'taskData' as keyof Task,
      label: t('form.taskData'),
      type: 'textarea' as const,
      required: false,
      placeholder: t('form.taskDataPlaceholder'),
    },
    {
      name: 'fieldIdsOnlyIncluded' as keyof Task,
      label: t('form.fieldIdsOnlyIncluded'),
      type: 'textarea' as const,
      required: false,
      placeholder: t('form.fieldIdsOnlyIncluded'),
    }
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
        searchKey="taskName"
      />

      <CrudModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        mode={modalMode}
        title={modalMode === 'create' ? t('createTitle') : t('editTitle')}
        description={modalMode === 'create' ? t('createDescription') : t('editDescription')}
        schema={taskSchema}
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