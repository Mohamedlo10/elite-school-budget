"use client"

import { useState } from "react"
import { useAppDispatch } from "@/store/hooks"
import { updateSubmissionStatus } from "@/store/features/submissions/submissionsSlice"
import { toast } from "sonner"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

interface ReviewSubmissionDialogProps {
  submission: any
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ReviewSubmissionDialog({
  submission,
  open,
  onOpenChange,
}: ReviewSubmissionDialogProps) {
  const [comment, setComment] = useState("")
  const dispatch = useAppDispatch()

  const handleSubmit = async () => {
    try {
      await dispatch(updateSubmissionStatus({ 
        id: submission?.id,
        status: 'REVISION_NEEDED',
        comment
      })).unwrap()
      toast.success("Commentaire envoyé avec succès")
      onOpenChange(false)
    } catch (error) {
      toast.error("Erreur lors de l'envoi", {
        description: error as string
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Demander une révision</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Textarea
            placeholder="Écrivez votre commentaire ici..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={4}
          />
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Annuler
            </Button>
            <Button onClick={handleSubmit}>
              Envoyer
            </Button>
          </div>
        </div>
        <DialogDescription>
          <div className="text-muted-foreground pt-3 text-base">
            <ul className="mt-4 list-disc pl-4 space-y-2">
              {/* ... contenu de la liste ... */}
            </ul>
          </div>
        </DialogDescription>
      </DialogContent>
    </Dialog>
  )
} 