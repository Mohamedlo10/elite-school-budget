"use client"

import { useEffect, useState } from "react"
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
import { useAppDispatch } from "@/store/hooks"
import { toast } from "sonner"
import { updateCategory } from "@/store/features/categories/categoriesSlice"
import { Category } from "@/types/models"

interface EditCategoryDialogProps {
  category: Category
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function EditCategoryDialog({
  category,
  open,
  onOpenChange,
}: EditCategoryDialogProps) {
  const [formData, setFormData] = useState({
    name: "",
    description: ""
  })
  const [isLoading, setIsLoading] = useState(false)
  const dispatch = useAppDispatch()

  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name,
        description: category.description || ""
      })
    }
  }, [category])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      await dispatch(updateCategory({categoryData: {...formData, departmentId: category.departmentId}, id: category.id})).unwrap()
      toast.success("Catégorie modifiée avec succès")
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
          <DialogTitle>Modifier la catégorie</DialogTitle>
          <DialogDescription>
            Modifiez les informations de la catégorie ici.
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
              {isLoading ? "Modification..." : "Modifier"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
} 