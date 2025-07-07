import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

type ViewDescriptionDialogProps = {
  description: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ViewDescriptionDialog({
  description,
  open,
  onOpenChange,
}: ViewDescriptionDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Description complète</DialogTitle>
        </DialogHeader>
        <div className="mt-4 text-sm text-gray-700 whitespace-pre-wrap">
          {description}
        </div>
      </DialogContent>
    </Dialog>
  )
} 