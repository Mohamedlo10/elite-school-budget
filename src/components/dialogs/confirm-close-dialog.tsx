import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { AlertTriangle } from "lucide-react"

type ConfirmCloseDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
}

export function ConfirmCloseDialog({
  open,
  onOpenChange,
  onConfirm,
}: ConfirmCloseDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-amber-600">
            <AlertTriangle className="h-5 w-5" />
            Confirmation de clôture
          </DialogTitle>
          <DialogDescription className="pt-3 text-base">
            Attention : La clôture de la période de collecte est une action irréversible.
          </DialogDescription>
          <div className="mt-4 text-sm">
            <ul className="list-disc pl-4 space-y-2">
              <li>Vous ne pourrez plus revenir en arrière</li>
              <li>Les utilisateurs ne pourront plus soumettre de nouveaux besoins</li>
              <li>Vous devrez créer une nouvelle période pour le prochain budget</li>
            </ul>
          </div>
        </DialogHeader>
        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Annuler
          </Button>
          <Button 
            variant="destructive" 
            onClick={() => {
              onConfirm()
              onOpenChange(false)
            }}
          >
            Clôturer la période
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 