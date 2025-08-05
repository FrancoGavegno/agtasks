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
import { projectSchema, type Project } from '@/lib/schemas'
import { toast } from '@/hooks/use-toast'

// Type for Project with required id (from API responses)
type ProjectWithId = Project & {
  id: string
  createdAt: string
  updatedAt: string
}

export default function ProjectsPage() {
  const t = useTranslations('Admin.Projects')
  const commonT = useTranslations('Common')
  
  const [data, setData] = useState<ProjectWithId[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create')
  const [selectedItem, setSelectedItem] = useState<ProjectWithId | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [itemToDelete, setItemToDelete] = useState<ProjectWithId | null>(null)
  const [showDeleted, setShowDeleted] = useState(false)

  // Load data
  const loadData = async () => {
    try {
      setLoading(true)
      const result = await apiClient.listProjects({ deleted: showDeleted, limit: 20 })
      setData(result.items as ProjectWithId[])
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
    await apiClient.createProject(formData)
    await loadData()
  }

  // Handle update
  const handleUpdate = async (formData: any) => {
    if (!selectedItem) return
    await apiClient.updateProject(selectedItem.id, formData)
    await loadData()
  }

  // Handle soft delete
  const handleSoftDelete = async () => {
    if (!itemToDelete) return
    try {
      await apiClient.updateProject(itemToDelete.id, { deleted: true })
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
  const handleRestore = async (project: ProjectWithId) => {
    try {
      await apiClient.updateProject(project.id, { deleted: false })
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
  const columns: ColumnDef<ProjectWithId>[] = [
    {
      accessorKey: 'name',
      header: t('columns.name'),
    },
    {
      accessorKey: 'domainId',
      header: t('columns.domainId'),
    },
    {
      accessorKey: 'areaId',
      header: t('columns.areaId'),
    },
    {
      accessorKey: 'serviceDeskId',
      header: t('columns.serviceDeskId'),
    },
    {
      accessorKey: 'requestTypeId',
      header: t('columns.requestTypeId'),
    },
    {
      accessorKey: 'language',
      header: t('columns.language'),
      cell: ({ row }) => {
        const language = row.getValue('language')
        return language && typeof language === 'string' ? (
          <Badge variant="secondary">
            {language}
          </Badge>
        ) : '-'
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
      name: 'domainId' as keyof Project,
      label: t('form.domainId'),
      type: 'text' as const,
      required: true,
      placeholder: t('form.domainIdPlaceholder'),
    },
    {
      name: 'areaId' as keyof Project,
      label: t('form.areaId'),
      type: 'text' as const,
      required: true,
      placeholder: t('form.areaIdPlaceholder'),
    },
    {
      name: 'name' as keyof Project,
      label: t('form.name'),
      type: 'text' as const,
      required: true,
      placeholder: t('form.namePlaceholder'),
    },
    {
      name: 'serviceDeskId' as keyof Project,
      label: t('form.serviceDeskId'),
      type: 'text' as const,
      required: true,
      placeholder: t('form.serviceDeskIdPlaceholder'),
    },
    {
      name: 'requestTypeId' as keyof Project,
      label: t('form.requestTypeId'),
      type: 'text' as const,
      required: true,
      placeholder: t('form.requestTypeIdPlaceholder'),
    },
    {
      name: 'queueId' as keyof Project,
      label: t('form.queueId'),
      type: 'text' as const,
      required: false,
      placeholder: t('form.queueIdPlaceholder'),
    },
    {
      name: 'language' as keyof Project,
      label: t('form.language'),
      type: 'select' as const,
      required: false,
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
        schema={projectSchema}
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