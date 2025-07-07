import { useState } from "react"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { toast } from "sonner"
import { createPeriod } from "@/store/features/periods/periodsSlice"

type CreatePeriodDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CreatePeriodDialog({
  open,
  onOpenChange,
}: CreatePeriodDialogProps) {
  const [formData, setFormData] = useState({
    startDate: "",
    endDate: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const dispatch = useAppDispatch()
  const { user: currentUser } = useAppSelector((state) => state.auth)

  const validateDates = () => {
    const start = new Date(formData.startDate)
    const end = new Date(formData.endDate)
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    if (start < today) {
      toast.error("La date de début doit être supérieure ou égale à aujourd'hui")
      return false
    }

    if (end <= start) {
      toast.error("La date de fin doit être supérieure à la date de début")
      return false
    }

    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateDates()) return
    
    setIsLoading(true)
    try {
      await dispatch(createPeriod({
        ...formData,
        departmentId: currentUser?.department?.id
      })).unwrap()
      toast.success("Période créée avec succès")
      setFormData({ startDate: "", endDate: "" })
      onOpenChange(false)
    } catch (error) {
      toast.error("Erreur lors de la création", {
        description: error as string
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newStartDate = e.target.value
    setFormData(prev => ({
      ...prev,
      startDate: newStartDate,
      endDate: prev.endDate && new Date(newStartDate) >= new Date(prev.endDate) ? "" : prev.endDate
    }))
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Nouvelle période de collecte</DialogTitle>
          <DialogDescription>
            Définissez une nouvelle période de collecte des besoins.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">Date de début</Label>
              <Input
                id="startDate"
                type="date"
                min={new Date().toISOString().split('T')[0]}
                value={formData.startDate}
                onChange={handleStartDateChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endDate">Date de fin</Label>
              <Input
                id="endDate"
                type="date"
                min={formData.startDate || new Date().toISOString().split('T')[0]}
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                required
                disabled={!formData.startDate}
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