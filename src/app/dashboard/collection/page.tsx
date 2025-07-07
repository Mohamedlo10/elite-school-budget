"use client"

import { useEffect } from "react"
import { CollectionPeriod } from "@/components/collection-period"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import { Calendar, Clock, CheckCircle, Users, Loader2 } from "lucide-react"
import { fetchDepartmentSubmissions } from "@/store/features/submissions/submissionsSlice"
import { fetchCurrentPeriod } from "@/store/features/periods/periodsSlice"
import { fetchDepartmentStaff } from "@/store/features/users/usersSlice"

export default function CollectionPage() {
  const dispatch = useAppDispatch()
  const { currentPeriod } = useAppSelector((state) => state.periods)
  const { submissions, isLoading } = useAppSelector((state) => state.submissions)
  const { users } = useAppSelector((state) => state.users)
  const { user: currentUser } = useAppSelector((state) => state.auth)

  useEffect(() => {
    if (currentUser?.department?.id) {
      dispatch(fetchDepartmentSubmissions(currentUser.department.id))
      dispatch(fetchCurrentPeriod(currentUser.department.id))
      dispatch(fetchDepartmentStaff(currentUser.department.id))
    }
  }, [dispatch, currentUser])

  if (isLoading) {
    return (
      <div className="p-6 flex justify-center items-center h-full">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    )
  }

  // Filter submissions for current period
  const currentSubmissions = submissions.filter(sub => 
    sub.periodId === currentPeriod?.id
  )

  const stats = {
    totalSubmissions: currentSubmissions.length,
    activeUsers: users.length,
    daysRemaining: currentPeriod 
      ? Math.ceil((new Date(currentPeriod.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
      : 0
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
              <BreadcrumbPage>Période de Collecte</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>

      <div className="flex flex-col space-y-6 p-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Gestion de la Période de Collecte</h1>
            <p className="text-muted-foreground mt-1">
              Configurez et suivez la période de collecte des besoins pour {currentUser?.department?.name}
            </p>
          </div>
          <Badge 
            variant="outline" 
            className={`px-4 py-2 flex items-center gap-2 ${
              currentPeriod?.status === 'OPEN' 
                ? 'bg-green-100 text-green-800' 
                : 'bg-yellow-100 text-yellow-800'
            }`}
          >
            <Calendar className="h-4 w-4" />
            {currentPeriod?.status === 'OPEN' ? 'Période active' : 'Période fermée'}
          </Badge>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Jours Restants</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.daysRemaining}</div>
              <p className="text-xs text-muted-foreground">
                Avant la fin de la période
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Soumissions</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalSubmissions}</div>
              <p className="text-xs text-muted-foreground">
                Besoins exprimés dans le département
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Utilisateurs Actifs</CardTitle>
              <Users className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activeUsers}</div>
              <p className="text-xs text-muted-foreground">
                Membres du département
              </p>
            </CardContent>
          </Card>
        </div>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Configuration de la Période</CardTitle>
          </CardHeader>
          <CardContent>
            <CollectionPeriod />
          </CardContent>
        </Card>
      </div>
    </>
  )
} 