"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import { createUser } from "@/store/features/users/usersSlice"
import { fetchDepartments } from "@/store/features/departments/departmentsSlice"
import { toast } from "sonner"
import { Role } from "@/types/models"
import { ROLE_LABELS } from "@/constants/roles"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { Plus } from "lucide-react"
import { CreateDepartmentDialog } from "./create-department-dialog"

interface CreateUserDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CreateUserDialog({
  open,
  onOpenChange,
}: CreateUserDialogProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
    departmentId: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [showNoDepartmentsAlert, setShowNoDepartmentsAlert] = useState(false)
  const [showCreateDepartmentDialog, setShowCreateDepartmentDialog] = useState(false)
  const dispatch = useAppDispatch()
  const { departments } = useAppSelector((state) => state.departments)
  const { user: currentUser } = useAppSelector((state) => state.auth)

  useEffect(() => {
    dispatch(fetchDepartments())
  }, [])

  useEffect(() => {
    if (open) {
      dispatch(fetchDepartments())
    }
  }, [open, dispatch])

  useEffect(() => {
    if (open && departments.length === 0 && currentUser?.role === Role.ADMIN) {
      setShowNoDepartmentsAlert(true)
    }
  }, [open, departments, currentUser])

  useEffect(() => {
    // Set default role to STAFF for department head
    if (currentUser?.role === Role.DEPARTMENT_HEAD) {
      //dispatch(fetchDepartments())
      setFormData(prev => ({ 
        ...prev, 
        role: Role.STAFF,
        departmentId: currentUser.department?.id || ""
      }))
    }
  }, [currentUser])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.departmentId && formData.role !== Role.ADMIN) {
      toast.error("Veuillez sélectionner un département")
      return
    }

    setIsLoading(true)
    try {
      const submitData = {
        ...formData,
        departmentId: formData.role === Role.ADMIN ? undefined : formData.departmentId,
      }
      await dispatch(createUser(submitData)).unwrap()
      toast.success("Utilisateur créé avec succès")
      setFormData({
        name: "",
        email: "",
        password: "",
        role: currentUser?.role === Role.DEPARTMENT_HEAD ? Role.STAFF : "",
        departmentId: "",
      })
      onOpenChange(false)
    } catch (error) {
      toast.error("Erreur lors de la création", {
        description: error as string
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateDepartment = () => {
    setShowNoDepartmentsAlert(false)
    setShowCreateDepartmentDialog(true)
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Créer un utilisateur</DialogTitle>
            <DialogDescription>
              Ajoutez un nouvel utilisateur en remplissant les informations ci-dessous.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nom complet</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Entrez le nom complet"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="Entrez l'adresse email"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Mot de passe</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="Entrez le mot de passe"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Rôle</Label>
                <Select
                  value={formData.role}
                  onValueChange={(value) => setFormData({ ...formData, role: value })}
                  disabled={currentUser?.role === Role.DEPARTMENT_HEAD}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez un rôle" />
                  </SelectTrigger>
                  <SelectContent>
                    {currentUser?.role === Role.ADMIN ? (
                      <>
                        <SelectItem value={Role.ADMIN}>{ROLE_LABELS.ADMIN}</SelectItem>
                        <SelectItem value={Role.DEPARTMENT_HEAD}>{ROLE_LABELS.DEPARTMENT_HEAD}</SelectItem>
                        <SelectItem value={Role.STAFF}>{ROLE_LABELS.STAFF}</SelectItem>
                      </>
                    ) : (
                      <SelectItem value={Role.STAFF}>Personnel</SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>
              {formData.role !== Role.ADMIN && (
                <div className="space-y-2">
                  <Label htmlFor="department">Département</Label>
                  <Select
                    value={formData.departmentId}
                    onValueChange={(value) => setFormData({ ...formData, departmentId: value })}
                    disabled={currentUser?.role === Role.DEPARTMENT_HEAD}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionnez un département" />
                    </SelectTrigger>
                    <SelectContent>
                      {departments.map((department) => (
                        <SelectItem key={department.id} value={department.id}>
                          {department.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Annuler
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Création..." : "Créer"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={showNoDepartmentsAlert} onOpenChange={setShowNoDepartmentsAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Aucun département</AlertDialogTitle>
            <AlertDialogDescription>
              Vous devez créer au moins un département avant de pouvoir ajouter des utilisateurs.
              Voulez-vous créer un département maintenant ?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => onOpenChange(false)}>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleCreateDepartment}>
              <Plus className="mr-2 h-4 w-4" />
              Créer un département
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <CreateDepartmentDialog
        open={showCreateDepartmentDialog}
        onOpenChange={setShowCreateDepartmentDialog}
      />
    </>
  )
} 