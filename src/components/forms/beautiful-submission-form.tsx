"use client"

import { useEffect, useState } from "react"
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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card"
import { toast } from "sonner"
import { createSubmission } from "@/store/features/submissions/submissionsSlice"
import { Package2, Receipt, Calculator, FileText } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { fetchDepartmentCategories } from "@/store/features/categories/categoriesSlice"
export function BeautifulSubmissionForm() {
  const dispatch = useAppDispatch()
  const { categories } = useAppSelector((state) => state.categories)
  const { currentPeriod } = useAppSelector((state) => state.periods)
  const { user: currentUser } = useAppSelector((state) => state.auth)
  const [isLoading, setIsLoading] = useState(false)


  useEffect(() => {
    if (currentUser?.department?.id) {
      dispatch(fetchDepartmentCategories(currentUser.department.id))
    }
  }, [dispatch, currentUser?.department?.id])

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    quantity: 1,
    unitPrice: 0,
    reference: "",
    justification: "",
    categoryId: "",
  })

  const calculateTotal = () => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF'
    }).format(formData.quantity * formData.unitPrice)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.categoryId) {
      toast.error("Veuillez sélectionner une catégorie")
      return
    }
    
    setIsLoading(true)
    try {
      await dispatch(createSubmission({
        ...formData,
        departmentId: currentUser?.department?.id,
        periodId: currentPeriod?.id
      })).unwrap()
      
      toast.success("Soumission créée avec succès")
      setFormData({
        title: "",
        description: "",
        quantity: 1,
        unitPrice: 0,
        reference: "",
        justification: "",
        categoryId: ""
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
    <Card className="max-w-2xl mx-auto shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-2xl">
          <FileText className="h-6 w-6 text-primary" />
          Nouveau Besoin
        </CardTitle>
        <CardDescription>
          Remplissez le formulaire ci-dessous pour soumettre votre besoin
        </CardDescription>
        </CardHeader>
      
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          <div className="grid gap-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="title">Titre du besoin</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Ex: Ordinateur portable"
                  className="w-full"
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
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description détaillée</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Décrivez votre besoin en détail..."
                className="min-h-[120px] resize-none"
                required
              />
            </div>

            <Separator />

            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="quantity">Quantité</Label>
                <div className="relative">
                  <Package2 className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="quantity"
                    type="number"
                    min="1"
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) })}
                    className="pl-9"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="unitPrice">Prix unitaire</Label>
                <div className="relative">
                  <Receipt className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="unitPrice"
                    type="number"
                    min="0"
                    value={formData.unitPrice}
                    onChange={(e) => setFormData({ ...formData, unitPrice: parseFloat(e.target.value) })}
                    className="pl-9"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Total estimé</Label>
                <div className="relative">
                  <Calculator className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    value={calculateTotal()}
                    readOnly
                    className="pl-9 bg-muted"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="reference">Référence (optionnel)</Label>
              <Input
                id="reference"
                value={formData.reference}
                onChange={(e) => setFormData({ ...formData, reference: e.target.value })}
                placeholder="Référence du produit ou service"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="justification">Justification</Label>
              <Textarea
                id="justification"
                value={formData.justification}
                onChange={(e) => setFormData({ ...formData, justification: e.target.value })}
                placeholder="Justifiez la nécessité de ce besoin..."
                className="min-h-[100px] resize-none"
                required
              />
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex justify-end mt-2 gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              setFormData({
                title: "",
                description: "",
                quantity: 1,
                unitPrice: 0,
                reference: "",
                justification: "",
                categoryId: ""
              })
            }}
          >
            Réinitialiser
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <>
                <span className="animate-spin mr-2">⏳</span>
                Soumission...
              </>
            ) : (
              "Soumettre le besoin"
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
} 