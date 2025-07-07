import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAppSelector } from "@/store/hooks"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

export function PeriodGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const { currentPeriod } = useAppSelector((state) => state.periods)

  useEffect(() => {
    if (!currentPeriod || currentPeriod.status !== 'OPEN') {
      router.push('/dashboard')
    }
  }, [currentPeriod, router])

  if (!currentPeriod || currentPeriod.status !== 'OPEN') {
    return (
      <Alert variant="destructive" className="m-6">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Accès non autorisé</AlertTitle>
        <AlertDescription>
          La période de collecte n'est pas active. Veuillez contacter votre administrateur.
        </AlertDescription>
      </Alert>
    )
  }

  return children
} 