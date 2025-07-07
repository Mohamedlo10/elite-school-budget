"use client"

import { useState, useEffect } from "react"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import { User, Role } from "@/types/models"
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell
} from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { 
  Edit, 
  Trash2, 
  Users, 
  Building,
  Search,
  Plus,
  ShieldCheck,
  UserCog,
  Loader2
} from "lucide-react"
import { toast } from "sonner"
import { deleteUser, fetchUsers } from "@/store/features/users/usersSlice"
import { CreateUserDialog } from "@/components/dialogs/create-user-dialog"
import { EditUserDialog } from "@/components/dialogs/edit-user-dialog"
import { ROLE_LABELS } from "@/constants/roles"
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

export default function UsersList() {
  const dispatch = useAppDispatch()
  const { users, isLoading, error } = useAppSelector((state) => state.users)
  const { user: currentUser } = useAppSelector((state) => state.auth)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    dispatch(fetchUsers())
  }, [dispatch])

  // Filter out the current admin and apply search
  const filteredUsers = users
    .filter(user => user.id !== currentUser?.id)
    .filter(user => 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    )

  const stats = {
    total: filteredUsers.length,
    admins: filteredUsers.filter(user => user.role === Role.ADMIN).length,
    departmentHeads: filteredUsers.filter(user => user.role === Role.DEPARTMENT_HEAD).length,
    staff: filteredUsers.filter(user => user.role === Role.STAFF).length
  }

  const handleDelete = async (id: string) => {
    try {
      await dispatch(deleteUser(id)).unwrap()
      toast.success("Utilisateur supprimé avec succès")
    } catch (error) {
      toast.error("Erreur lors de la suppression", {
        description: error as string
      })
    }
  }

  const handleEdit = (user: User) => {
    setSelectedUser(user)
    setIsEditDialogOpen(true)
  }

  const getRoleBadgeClass = (role: Role) => {
    switch (role) {
      case Role.ADMIN:
        return "bg-red-100 text-red-800"
      case Role.DEPARTMENT_HEAD:
        return "bg-blue-100 text-blue-800"
      case Role.STAFF:
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (isLoading) {
    return (<div className="p-6 flex justify-center h-full items-center">
      <Loader2 className="h-6 w-6 animate-spin" />
    </div>)
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
              <BreadcrumbPage>Gestion des Utilisateurs</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>

      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Gestion des Utilisateurs</h1>
          <Button onClick={() => setIsCreateDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Ajouter un utilisateur
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Utilisateurs</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
              <p className="text-xs text-muted-foreground">
                Utilisateurs actifs
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Administrateurs</CardTitle>
              <ShieldCheck className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.admins}</div>
              <p className="text-xs text-muted-foreground">
                Accès complet
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Chefs de Département</CardTitle>
              <UserCog className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.departmentHeads}</div>
              <p className="text-xs text-muted-foreground">
                Gestionnaires
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Personnel</CardTitle>
              <Users className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.staff}</div>
              <p className="text-xs text-muted-foreground">
                Membres du personnel
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="flex gap-4 items-center">
          <div className="flex-1">
            <Input
              placeholder="Rechercher un utilisateur..."
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
                <TableHead>Nom</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Rôle</TableHead>
                <TableHead>Département</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Badge className={`${getRoleBadgeClass(user.role)}`}>
                      {ROLE_LABELS[user.role]}
                    </Badge>
                  </TableCell>
                  <TableCell>{user.department?.name || '-'}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleEdit(user)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleDelete(user.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {filteredUsers.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-4">
                    Aucun utilisateur trouvé
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <CreateUserDialog
          open={isCreateDialogOpen}
          onOpenChange={setIsCreateDialogOpen}
        />

        <EditUserDialog
          user={selectedUser}
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
        />
      </div>
    </>
  )
} 