import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import { updatePeriodStatus } from "@/store/features/periods/periodsSlice"
import { toast } from "sonner"
import { ConfirmCloseDialog } from "./dialogs/confirm-close-dialog"

type PeriodStatusButtonProps = {
  periodId: string
  currentStatus: 'OPEN' | 'CLOSED' | 'ARCHIVED'
  disabled?: boolean
}

export function PeriodStatusButton({ periodId, currentStatus, disabled }: PeriodStatusButtonProps) {
  const dispatch = useAppDispatch()
  const { user: currentUser } = useAppSelector((state) => state.auth)
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false)

  const getNextStatus = () => {
    switch (currentStatus) {
      case 'OPEN':
        return 'CLOSED'
      case 'CLOSED':
        return 'ARCHIVED'
      default:
        return currentStatus
    }
  }

  const getButtonText = () => {
    switch (currentStatus) {
      case 'OPEN':
        return 'Clôturer la période'
      case 'CLOSED':
      case 'ARCHIVED':
        return 'Période Cloturée'
      default:
        return 'Changer le statut'
    }
  }

  const handleStatusChange = async () => {
    if (currentStatus === 'OPEN') {
      setIsConfirmDialogOpen(true)
      return
    }
    
    await updateStatus()
  }

  const updateStatus = async () => {
    const nextStatus = getNextStatus()
    try {
      await dispatch(updatePeriodStatus({
        periodId,
        status: nextStatus,
        departmentId: currentUser?.department?.id
      })).unwrap()
      
      toast.success(`Période ${nextStatus === 'CLOSED' ? 'clôturée' : 'archivée'} avec succès`)
    } catch (error) {
      toast.error("Erreur lors de la mise à jour du statut", {
        description: error as string
      })
    }
  }

  return (
    <>
      <Button
        onClick={handleStatusChange}
        disabled={disabled || currentStatus === 'ARCHIVED' || currentStatus === 'CLOSED'}
        variant={currentStatus === 'ARCHIVED' ? 'outline' : 'default'}
      >
        {getButtonText()}
      </Button>

      <ConfirmCloseDialog
        open={isConfirmDialogOpen}
        onOpenChange={setIsConfirmDialogOpen}
        onConfirm={updateStatus}
      />
    </>
  )
} 