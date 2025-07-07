"use client"

import { useState, useEffect } from "react"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import { fetchDepartments, deleteDepartment } from "@/store/features/departments/departmentsSlice"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Edit, Trash2, Users, FileText, Building, Search, Plus, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { CreateDepartmentDialog } from "@/components/dialogs/create-department-dialog"
import { EditDepartmentDialog } from "@/components/dialogs/edit-department-dialog"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"

export default function DepartmentsList() {
  const dispatch = useAppDispatch()
  const { departments, isLoading, error } = useAppSelector((state) => state.departments)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedDepartment, setSelectedDepartment] = useState(null)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)

  useEffect(() => {
    dispatch(fetchDepartments())
  }, [dispatch])

  const handleDelete = async (id: string) => {
    try {
      await dispatch(deleteDepartment(id)).unwrap()
      toast.success("Département supprimé avec succès")
    } catch (error) {
      toast.error("Erreur lors de la suppression", {
        description: error as string
      })
    }
  }

  const handleEdit = (department: any) => {
    setSelectedDepartment(department)
    setIsEditDialogOpen(true)
  }

  const filteredDepartments = departments.filter(dept =>
    dept.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

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
              <BreadcrumbPage>Départements</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Gestion des Départements</h1>
          <Button onClick={() => setIsCreateDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Ajouter un département
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Départements</CardTitle>
              <Building className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{departments.length}</div>
              <p className="text-xs text-muted-foreground">
                Départements actifs
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Personnel</CardTitle>
              <Users className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {departments.reduce((acc, dept) => acc + (dept.users?.length || 0), 0)}
              </div>
              <p className="text-xs text-muted-foreground">
                Tous départements confondus
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Soumissions</CardTitle>
              <FileText className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {departments.reduce((acc, dept) => acc + (dept.submissions?.length || 0), 0)}
              </div>
              <p className="text-xs text-muted-foreground">
                Besoins exprimés
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="flex gap-4 items-center">
          <div className="flex-1">
            <Input
              placeholder="Rechercher un département..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>
        </div>

        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nom du département</TableHead>
                <TableHead>Chef de département</TableHead>
                <TableHead>Nombre d'utilisateurs</TableHead>
                <TableHead>Nombre de soumissions</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDepartments.map((department) => (
                <TableRow key={department.id}>
                  <TableCell className="font-medium">{department.name}</TableCell>
                  <TableCell>
                    {department.users?.find(u => u.role === 'DEPARTMENT_HEAD')?.name || '-'}
                  </TableCell>
                  <TableCell>{department.users?.length || 0}</TableCell>
                  <TableCell>{department.submissions?.length || 0}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-green-100 text-green-800">
                      Actif
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleEdit(department)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleDelete(department.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {filteredDepartments.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-4">
                    Aucun département trouvé
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <CreateDepartmentDialog
          open={isCreateDialogOpen}
          onOpenChange={setIsCreateDialogOpen}
        />

        <EditDepartmentDialog
          department={selectedDepartment}
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
        />
      </div>
    </>
  )
} 