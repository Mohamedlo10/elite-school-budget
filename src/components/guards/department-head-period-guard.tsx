"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAppSelector } from "@/store/hooks"
import { Role } from "@/types/models"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Calendar } from "lucide-react"

export function DepartmentHeadPeriodGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [showAlert, setShowAlert] = useState(false)
  const { currentPeriod } = useAppSelector((state) => state.periods)
  const { user: currentUser } = useAppSelector((state) => state.auth)

  useEffect(() => {
    if (
      currentUser?.role === Role.DEPARTMENT_HEAD && 
      (!currentPeriod || currentPeriod.status !== 'OPEN')
    ) {
      setShowAlert(true)
    }
  }, [currentPeriod, currentUser])

  const handleRedirect = () => {
    router.push('/dashboard/collection')
  }

  return (
    <>
      {children}
      
      <AlertDialog open={showAlert} onOpenChange={setShowAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Configuration requise
            </AlertDialogTitle>
            <AlertDialogDescription>
              Aucune période de collecte n'est actuellement active pour votre département. 
              Vous devez configurer une période pour permettre à vos utilisateurs de soumettre leurs besoins.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={handleRedirect}>
              Configurer la période
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
} 