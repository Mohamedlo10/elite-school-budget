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
import { updateUser } from "@/store/features/users/usersSlice"
import { toast } from "sonner"
import { User, Role } from "@/types/models"
import { fetchDepartments as fetchDepartmentsSlice } from "@/store/features/departments/departmentsSlice"
import { ROLE_LABELS } from "@/constants/roles"

interface EditUserDialogProps {
  user: User | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function EditUserDialog({
  user,
  open,
  onOpenChange,
}: EditUserDialogProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "",
    departmentId: "",
    password: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const dispatch = useAppDispatch()
  const { departments } = useAppSelector((state) => state.departments)
  const { user: currentUser } = useAppSelector((state) => state.auth)

  useEffect(() => {
    if (open && user?.role !== 'ADMIN') {
      dispatch(fetchDepartmentsSlice())
    }
  }, [open, user, dispatch])

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email,
        role: user.role,
        password: user.password || "",
        departmentId: user.department?.id || "",
      })
    }
  }, [user])

  useEffect(() => {
    if (formData.role === 'ADMIN') {
      setFormData(prev => ({ ...prev, departmentId: "" }))
    }
  }, [formData.role])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    setIsLoading(true)
    try {
      const submitData = {
        ...formData,
        departmentId: formData.role === 'ADMIN' ? undefined : formData.departmentId,
      }

      await dispatch(updateUser({userData: submitData, id: user.id})).unwrap()
      toast.success("Utilisateur modifié avec succès")
      onOpenChange(false)
    } catch (error) {
      toast.error("Erreur lors de la modification", {
        description: error as string
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Modifier l'utilisateur</DialogTitle>
          <DialogDescription>
            Modifiez les informations de l'utilisateur ici.
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
            <div className="space-y-2">
              <Label htmlFor="department">Département</Label>
              <Select
                value={formData.departmentId}
                onValueChange={(value) => setFormData({ ...formData, departmentId: value })}
                disabled={currentUser?.role === Role.DEPARTMENT_HEAD || formData.role === Role.ADMIN}
              >
                <SelectTrigger>
                  <SelectValue placeholder={
                    formData.role === Role.ADMIN 
                      ? "Non applicable pour un administrateur" 
                      : "Sélectionnez un département"
                  } />
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
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Annuler
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Modification..." : "Modifier"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
} 