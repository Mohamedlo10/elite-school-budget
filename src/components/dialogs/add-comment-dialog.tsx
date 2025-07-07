import { useState } from "react"
import { useAppDispatch } from "@/store/hooks"
import { updateSubmissionComment, updateSubmissionStatus } from "@/store/features/submissions/submissionsSlice"
import { toast } from "sonner"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

type AddCommentDialogProps = {
  submissionId: string | null;
  status: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddCommentDialog({
  submissionId,
  status,
  open,
  onOpenChange,
}: AddCommentDialogProps) {
  const [comment, setComment] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const dispatch = useAppDispatch()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      // First update the status
      if (submissionId) {
        await dispatch(updateSubmissionStatus({ 
          id: submissionId,
          status,
          comment 
        })).unwrap()
      }
      
      toast.success("Statut et commentaire mis à jour avec succès")
      onOpenChange(false)
    } catch (error) {
      toast.error("Erreur lors de la mise à jour", {
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
          <DialogTitle>Ajouter un commentaire</DialogTitle>
          <DialogDescription>
            Ajoutez un commentaire pour expliquer votre décision.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="comment">Commentaire</Label>
              <Textarea
                id="comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Votre commentaire..."
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Annuler
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Mise à jour..." : "Valider"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
} 