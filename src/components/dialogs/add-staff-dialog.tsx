"use client"

import { useState, useEffect } from "react"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import { Role } from "@/types/models"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import { createUser } from "@/store/features/users/usersSlice"
import { ROLE_LABELS } from "@/constants/roles"

interface AddStaffDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AddStaffDialog({
  open,
  onOpenChange,
}: AddStaffDialogProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: Role.STAFF,
  })
  const [isLoading, setIsLoading] = useState(false)
  const dispatch = useAppDispatch()
  const { user: currentUser } = useAppSelector((state) => state.auth)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      const submitData = {
        ...formData,
        departmentId: currentUser?.department?.id,
      }
      await dispatch(createUser(submitData)).unwrap()
      toast.success("Membre du personnel créé avec succès")
      setFormData({
        name: "",
        email: "",
        password: "",
        role: Role.STAFF,
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Ajouter un membre du personnel</DialogTitle>
          <DialogDescription>
            Créez un nouveau membre du personnel en remplissant les informations ci-dessous.
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
                onValueChange={(value) => setFormData({ ...formData, role: value  as Role})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionnez un rôle" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={Role.STAFF}>Personnel</SelectItem>
                </SelectContent>
              </Select>
            </div>
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
  )
} 