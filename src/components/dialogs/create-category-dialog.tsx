"use client"

import { useState } from "react"
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
import { Textarea } from "@/components/ui/textarea"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import { toast } from "sonner"
import { createCategory } from "@/store/features/categories/categoriesSlice"

interface CreateCategoryDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CreateCategoryDialog({
  open,
  onOpenChange,
}: CreateCategoryDialogProps) {
  const [formData, setFormData] = useState({
    name: "",
    description: ""
  })
  const [isLoading, setIsLoading] = useState(false)
  const dispatch = useAppDispatch()
  const { user: currentUser } = useAppSelector((state) => state.auth)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      await dispatch(createCategory({...formData, departmentId: currentUser?.department?.id})).unwrap()
      toast.success("Catégorie créée avec succès")
      setFormData({ name: "", description: "" })
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
          <DialogTitle>Ajouter une catégorie</DialogTitle>
          <DialogDescription>
            Créez une nouvelle catégorie en remplissant les informations ci-dessous.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nom de la catégorie</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Entrez le nom de la catégorie"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Entrez une description de la catégorie"
                rows={3}
              />
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