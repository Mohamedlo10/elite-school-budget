"use client"

import { useEffect } from "react"
import { useAppSelector, useAppDispatch } from "@/store/hooks"
import { BeautifulSubmissionForm } from "@/components/forms/beautiful-submission-form"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import { fetchCurrentPeriod } from "@/store/features/periods/periodsSlice"
import { BreadcrumbLink } from "@/components/ui/breadcrumb"
import { BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { BreadcrumbPage } from "@/components/ui/breadcrumb"
import { BreadcrumbList } from "@/components/ui/breadcrumb"
import { Breadcrumb } from "@/components/ui/breadcrumb"
import { BreadcrumbItem } from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"

export default function SubmitPage() {
  const dispatch = useAppDispatch()
  const { currentPeriod } = useAppSelector((state) => state.periods)
  const { user: currentUser } = useAppSelector((state) => state.auth)
  

  useEffect(() => {
    if (currentUser?.department?.id) {
      dispatch(fetchCurrentPeriod(currentUser.department.id))
    }
  }, [dispatch, currentUser])

  const getStatusMessage = () => {
    if (!currentPeriod) return "Aucune période de collecte n'est configurée."
    
    switch (currentPeriod.status) {
      case 'CLOSED':
        return "La période de collecte est clôturée. Vous ne pouvez plus soumettre de nouveaux besoins."
      case 'ARCHIVED':
        return "La période de collecte est archivée. Les soumissions sont définitivement fermées."
      default:
        return "La période de collecte n'est pas active."
    }
  }

  

  return (
    <>
    <header className="bg-background sticky top-0 flex shrink-0 items-center gap-2 border-b p-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
                  <BreadcrumbPage>Soumettre un besoin</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>             
    <div className="p-6">
      {/*<h1 className="text-2xl font-bold mb-6">Soumettre un besoin</h1>*/}
      
      {currentPeriod?.status === 'OPEN' ? (
        <BeautifulSubmissionForm />
      ) : (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Période non disponible</AlertTitle>
          <AlertDescription>
            {getStatusMessage()}
          </AlertDescription>
        </Alert>
      )}
    </div>
    </>
  )
} 