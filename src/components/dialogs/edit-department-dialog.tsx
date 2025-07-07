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
import { Department } from "@/types/models"
import { useAppDispatch } from "@/store/hooks"
import { updateDepartment } from "@/store/features/departments/departmentsSlice"
import { toast } from "sonner"

interface EditDepartmentDialogProps {
  department: Department | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function EditDepartmentDialog({
  department,
  open,
  onOpenChange,
}: EditDepartmentDialogProps) {
  const [name, setName] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const dispatch = useAppDispatch()

  useEffect(() => {
    if (department) {
      setName(department.name)
    }
  }, [department])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!department) return

    setIsLoading(true)
    try {
      await dispatch(updateDepartment({ id: department.id, name })).unwrap()
      toast.success("Département modifié avec succès")
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
          <DialogTitle>Modifier le département</DialogTitle>
          <DialogDescription>
            Modifiez les informations du département ici.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nom du département</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Entrez le nom du département"
                required
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