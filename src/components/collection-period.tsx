"use client"

import { useState, useEffect } from "react"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { fetchCurrentPeriod } from "@/store/features/periods/periodsSlice"
import { CreatePeriodDialog } from "./dialogs/create-period-dialog"
import { PeriodStatusButton } from "./period-status-button"
import { Badge } from "@/components/ui/badge"
import { PeriodStatus } from "@/types/models"
import { Loader2 } from "lucide-react"

export function CollectionPeriod() {
  const dispatch = useAppDispatch()
  const { currentPeriod, isLoading } = useAppSelector((state) => state.periods)
  const { user: currentUser } = useAppSelector((state) => state.auth)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)

  useEffect(() => {
    if (currentUser?.department?.id) {
      dispatch(fetchCurrentPeriod(currentUser.department.id))
    }
  }, [dispatch, currentUser])

  if (isLoading) {
    return (
      <div className="p-6 flex justify-center items-center h-full">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    )
  }

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
  }

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case PeriodStatus.OPEN:
        return 'default'
      case PeriodStatus.CLOSED:
        return 'secondary'
      case PeriodStatus.ARCHIVED:
        return 'outline'
      default:
        return 'default'
    }
  }

  const showCreateButton = !currentPeriod || 
    currentPeriod.status === PeriodStatus.CLOSED || 
    currentPeriod.status === PeriodStatus.ARCHIVED

  return (
    <div className="space-y-4">
      {currentPeriod ? (
        <div className="rounded-lg border p-4">
          <div className="flex justify-between items-start mb-4">
            <h2 className="font-semibold">Période de collecte {currentPeriod.year}</h2>
            <Badge variant={getStatusBadgeVariant(currentPeriod.status)}>
              {currentPeriod.status}
            </Badge>
          </div>
          <div className="space-y-4">
            <div className="space-y-2 text-sm">
              <p>Du {formatDate(currentPeriod.startDate)}</p>
              <p>Au {formatDate(currentPeriod.endDate)}</p>
            </div>
            <div className="pt-4 border-t flex justify-between items-center">
              <PeriodStatusButton
                periodId={currentPeriod.id}
                currentStatus={currentPeriod.status}
                disabled={isLoading}
              />
              {showCreateButton && (
                <Button onClick={() => setIsCreateDialogOpen(true)}>
                  Nouvelle période
                </Button>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center space-y-4">
          <p className="text-muted-foreground">
            Aucune période de collecte n'est configurée pour cette année.
          </p>
          <Button onClick={() => setIsCreateDialogOpen(true)}>
            Configurer la période
          </Button>
        </div>
      )}

      <CreatePeriodDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
      />
    </div>
  )
} 