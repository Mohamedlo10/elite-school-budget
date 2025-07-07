import { useState, useEffect } from "react"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { toast } from "sonner"
import { createSubmission } from "@/store/features/submissions/submissionsSlice"
import { fetchDepartmentCategories } from "@/store/features/categories/categoriesSlice"
import { fetchCurrentPeriod } from "@/store/features/periods/periodsSlice"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import { PeriodStatus } from "@/types/models"

export function SubmissionForm() {
  const dispatch = useAppDispatch()
  const { categories } = useAppSelector((state) => state.categories)
  const { currentPeriod } = useAppSelector((state) => state.periods)
  const { user: currentUser } = useAppSelector((state) => state.auth)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    quantity: 1,
    unitPrice: 0,
    reference: "",
    justification: "",
    categoryId: "",
    departmentId: "",
    periodId: ""
  })

  useEffect(() => {
    // console.log(currentUser)
    if (currentUser?.department?.id) {
      console.log(currentUser.department.id)
      dispatch(fetchDepartmentCategories(currentUser.department.id))
      dispatch(fetchCurrentPeriod(currentUser.department.id))
    }
  }, [dispatch, currentUser])
/*
  const getStatusMessage = () => {
    if (!currentPeriod) return "Aucune période de collecte n'est configurée."
    
    switch (currentPeriod.status) {
      case PeriodStatus.CLOSED:
        return "La période de collecte est clôturée. Vous ne pouvez plus soumettre de nouveaux besoins."
      case PeriodStatus.ARCHIVED:
        return "La période de collecte est archivée. Les soumissions sont définitivement fermées."
      default:
        return "La période de collecte n'est pas active."
    }
  }

  const isPeriodClosed = !currentPeriod || currentPeriod.status !== PeriodStatus.OPEN

  if (isPeriodClosed) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Période non disponible</AlertTitle>
        <AlertDescription>
          {getStatusMessage()}
        </AlertDescription>
      </Alert>
    )
  }
*/
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.categoryId) {
      toast.error("Veuillez sélectionner une catégorie")
      return
    }
    
    if (!currentPeriod) {
      toast.error("Aucune période de collecte active")
      return
    }
    
    setIsLoading(true)
    try {
      await dispatch(createSubmission({
        ...formData,
        departmentId: currentUser?.department?.id,
        periodId: currentPeriod.id
      })).unwrap()
      
      toast.success("Soumission créée avec succès")
      setFormData({
        title: "",
        description: "",
        quantity: 1,
        unitPrice: 0,
        reference: "",
        justification: "",
        departmentId: "",
        categoryId: "",
        periodId: ""
      })
    } catch (error) {
      toast.error("Erreur lors de la création", {
        description: error as string
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="title">Titre</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="Titre de la demande"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="category">Catégorie</Label>
          <Select
            value={formData.categoryId}
            onValueChange={(value) => setFormData({ ...formData, categoryId: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionnez une catégorie" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Description détaillée du besoin"
            rows={4}
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="quantity">Quantité</Label>
            <Input
              id="quantity"
              type="number"
              min="1"
              value={formData.quantity || 1}
              onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="unitPrice">Prix unitaire</Label>
            <Input
              id="unitPrice"
              type="number"
              min="0"
              step="0.01"
              value={formData.unitPrice || 0}
              onChange={(e) => {
                const value = e.target.value === '' ? 0 : parseFloat(e.target.value);
                setFormData({ ...formData, unitPrice: value });
              }}
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="reference">Référence (optionnel)</Label>
          <Input
            id="reference"
            value={formData.reference}
            onChange={(e) => setFormData({ ...formData, reference: e.target.value })}
            placeholder="Référence du produit"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="justification">Justification</Label>
          <Textarea
            id="justification"
            value={formData.justification}
            onChange={(e) => setFormData({ ...formData, justification: e.target.value })}
            placeholder="Justification du besoin"
            rows={3}
            required
          />
        </div>
      </div>

      <div className="flex justify-end gap-4">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Création..." : "Soumettre"}
        </Button>
      </div>
    </form>
  )
} 