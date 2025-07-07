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
import { Button } from "@/components/ui/button"
import { Edit, Loader2, Trash2, UserPlus } from "lucide-react"
import { toast } from "sonner"
import { fetchDepartmentStaff, deleteUser } from "@/store/features/users/usersSlice"
import { EditUserDialog } from "@/components/dialogs/edit-user-dialog"
import { ROLE_LABELS } from "@/constants/roles"
import { BreadcrumbLink, BreadcrumbSeparator, BreadcrumbItem, BreadcrumbList, BreadcrumbPage } from "@/components/ui/breadcrumb"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Breadcrumb } from "@/components/ui/breadcrumb"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  Users,
  Search,
  Filter,
  Mail,
  Building2,
  UserCircle,
  Shield,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { AddStaffDialog } from "@/components/dialogs/add-staff-dialog"

export default function StaffList() {
  const dispatch = useAppDispatch()
  const { users, isLoading, error } = useAppSelector((state) => state.users)
  const { user: currentUser } = useAppSelector((state) => state.auth)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [roleFilter, setRoleFilter] = useState<string | null>(null)
  const [isAddStaffDialogOpen, setIsAddStaffDialogOpen] = useState(false)

  useEffect(() => {
    if (currentUser?.department?.id) {
      dispatch(fetchDepartmentStaff(currentUser.department.id))
    }
  }, [dispatch, currentUser])

  const filteredStaff = users
    .filter(member => member.id !== currentUser?.id)
    .filter(member => 
      (roleFilter ? member.role === roleFilter : true) &&
      (searchTerm 
        ? member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          member.email.toLowerCase().includes(searchTerm.toLowerCase())
        : true
      )
    )

  const stats = {
    total: users.filter(member => member.id !== currentUser?.id).length,
    admin: users.filter(s => s.role === 'ADMIN' && s.id !== currentUser?.id).length,
    manager: users.filter(s => s.role === 'DEPARTMENT_HEAD' && s.id !== currentUser?.id).length,
    staff: users.filter(s => s.role === 'STAFF' && s.id !== currentUser?.id).length,
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

  const handleAssignProfile = (user: User) => {
    setSelectedUser(user)
  }

  const handleEdit = (user: User) => {
    setSelectedUser(user)
    setIsEditDialogOpen(true)
  }

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return <Badge variant="outline" className="bg-purple-100 text-purple-800">Administrateur</Badge>
      case 'MANAGER':
        return <Badge variant="outline" className="bg-blue-100 text-blue-800">Manager</Badge>
      case 'STAFF':
        return <Badge variant="outline" className="bg-green-100 text-green-800">Staff</Badge>
      default:
        return <Badge variant="outline">Inconnu</Badge>
    }
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
              <BreadcrumbPage>Liste du Personnel</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Liste du Personnel</h1>
          <p className="text-muted-foreground mt-1">
            Gérez les membres du personnel de votre département
          </p>
        </div>
        <Button onClick={() => setIsAddStaffDialogOpen(true)}>
          <UserPlus className="mr-2 h-4 w-4" />
          Ajouter un membre
        </Button>
      </div>

      <div className="flex gap-4 items-center">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher par nom ou email..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      <Card>
        <CardContent className="px-5">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nom</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Rôle</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStaff.map((member) => (
                <TableRow key={member.id}>
                  <TableCell className="font-medium">{member.name}</TableCell>
                  <TableCell>{member.email}</TableCell>
                  <TableCell>{getRoleBadge(member.role)}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(member)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(member.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <EditUserDialog
        user={selectedUser}
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
      />

      <AddStaffDialog
        open={isAddStaffDialogOpen}
        onOpenChange={setIsAddStaffDialogOpen}
      />
    </div>
    </>
  )
}