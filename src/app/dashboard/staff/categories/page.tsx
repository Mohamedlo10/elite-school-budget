"use client"

import { useState, useEffect } from "react"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Edit, Trash2, Plus, Search, FolderPlus, Loader2 } from "lucide-react"
import { CreateCategoryDialog } from "@/components/dialogs/create-category-dialog"
import { EditCategoryDialog } from "@/components/dialogs/edit-category-dialog"
import { toast } from "sonner"
import { deleteCategory, fetchDepartmentCategories } from "@/store/features/categories/categoriesSlice"
import { BreadcrumbLink, BreadcrumbSeparator, BreadcrumbItem, BreadcrumbList, BreadcrumbPage } from "@/components/ui/breadcrumb"
import { Breadcrumb } from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { ConfirmDeleteDialog } from "@/components/dialogs/confirm-delete-dialog"
import {Category} from "@/types/models";

export default function CategoriesList() {
  const dispatch = useAppDispatch()
  const { categories, isLoading, error } = useAppSelector((state) => state.categories)
  const { user: currentUser } = useAppSelector((state) => state.auth)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null)

  useEffect(() => {
    if (currentUser?.department?.id) {
      dispatch(fetchDepartmentCategories(currentUser.department.id))
    }
  }, [dispatch, currentUser])

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (category.description?.toLowerCase() || "").includes(searchTerm.toLowerCase())
  )

  const handleEdit = (category : Category) => {
    setSelectedCategory(category)
  }

  const handleDelete = async (categoryId: string) => {
    setCategoryToDelete(categoryId)
    setDeleteConfirmOpen(true)
  }

  const confirmDelete = async () => {
    if (!categoryToDelete) return
    
    try {
      await dispatch(deleteCategory(categoryToDelete)).unwrap()
      toast.success("Catégorie supprimée avec succès")
    } catch (error) {
      toast.error("Erreur lors de la suppression", {
        description: error as string
      })
    }
    setCategoryToDelete(null)
  }

  if (isLoading) {
    return (
      <div className="p-6 flex justify-center items-center h-full">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    )
  }

  if (error) {
    return <div className="p-6 text-red-500">Erreur: {error}</div>
  }

  return (
    <>
      <header className="bg-background sticky top-0 flex shrink-0 items-center gap-2 border-b p-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/dashboard/staff/list">Personnel</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Catégories</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>

      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Catégories de Soumission</h1>
            <p className="text-muted-foreground mt-1">
              Gérez les catégories de besoins pour votre département
            </p>
          </div>
          <Button onClick={() => setIsCreateDialogOpen(true)}>
            <FolderPlus className="mr-2 h-4 w-4" />
            Nouvelle Catégorie
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Catégories</CardTitle>
              <FolderPlus className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{categories.length}</div>
              <p className="text-xs text-muted-foreground">
                Catégories actives
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="flex gap-4 items-center">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher une catégorie..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        <Card>
          <CardContent className="px-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nom</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCategories.map((category) => (
                  <TableRow key={category.id}>
                    <TableCell className="font-medium">{category.name}</TableCell>
                    <TableCell>{category.description || '-'}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-green-100 text-green-800">
                        Active
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(category)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(category.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredCategories.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-4">
                      Aucune catégorie trouvée
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <CreateCategoryDialog
          open={isCreateDialogOpen}
          onOpenChange={setIsCreateDialogOpen}
        />

        {selectedCategory && (
          <EditCategoryDialog
            category={selectedCategory}
            open={!!selectedCategory}
            onOpenChange={() => setSelectedCategory(null)}
          />
        )}

        <ConfirmDeleteDialog
          open={deleteConfirmOpen}
          onOpenChange={setDeleteConfirmOpen}
          onConfirm={confirmDelete}
          title="Confirmer la suppression"
          description="Êtes-vous sûr de vouloir supprimer cette catégorie ? Cette action est irréversible et supprimera également tous les besoins associés à cette catégorie."
        />
      </div>
    </>
  )
} 