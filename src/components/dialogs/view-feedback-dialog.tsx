import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

type ViewFeedbackDialogProps = {
  feedback: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ViewFeedbackDialog({
  feedback,
  open,
  onOpenChange,
}: ViewFeedbackDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Commentaire</DialogTitle>
        </DialogHeader>
        <div className="mt-4 text-sm text-gray-700 whitespace-pre-wrap">
          {feedback}
        </div>
      </DialogContent>
    </Dialog>
  )
} 