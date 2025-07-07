"use client"

import { useState, useEffect } from "react"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MessageSquare, Plus, Filter, SlidersHorizontal, Loader2 } from "lucide-react"
import { fetchUserSubmissions } from "@/store/features/submissions/submissionsSlice"
import { fetchCurrentPeriod } from "@/store/features/periods/periodsSlice"
import { ViewFeedbackDialog } from "@/components/dialogs/view-feedback-dialog"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function MySubmissionsPage() {
  const dispatch = useAppDispatch()
  const { submissions, isLoading } = useAppSelector((state) => state.submissions)
  const { currentPeriod } = useAppSelector((state) => state.periods)
  const { user: currentUser } = useAppSelector((state) => state.auth)
  const [selectedFeedback, setSelectedFeedback] = useState("")
  const [isFeedbackDialogOpen, setIsFeedbackDialogOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string | null>(null)

  useEffect(() => {
    if (currentUser?.id) {
      dispatch(fetchUserSubmissions(currentUser.id))
      if (currentUser.department?.id) {
        dispatch(fetchCurrentPeriod(currentUser.department.id))
      }
    }
  }, [dispatch, currentUser])

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800">En attente</Badge>
      case 'APPROVED':
        return <Badge variant="outline" className="bg-green-100 text-green-800">Validé</Badge>
      case 'REJECTED':
        return <Badge variant="outline" className="bg-red-100 text-red-800">Rejeté</Badge>
      case 'REVISION_NEEDED':
        return <Badge variant="outline" className="bg-blue-100 text-blue-800">À réviser</Badge>
      default:
        return <Badge variant="outline">Inconnu</Badge>
    }
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF'
    }).format(price)
  }

  const handleFeedbackClick = (feedback: string) => {
    if (feedback) {
      setSelectedFeedback(feedback)
      setIsFeedbackDialogOpen(true)
    }
  }

  if (isLoading) {
    return (
      <div className="p-6 flex justify-center items-center h-full">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    )
  }

  const currentUserSubmissions = submissions
    .filter(sub => 
      sub.userId === currentUser?.id && 
      sub.periodId === currentPeriod?.id &&
      (statusFilter ? sub.status === statusFilter : true) &&
      (searchTerm ? sub.title.toLowerCase().includes(searchTerm.toLowerCase()) : true)
    )

  const stats = {
    total: currentUserSubmissions.length,
    pending: currentUserSubmissions.filter(s => s.status === 'PENDING').length,
    approved: currentUserSubmissions.filter(s => s.status === 'APPROVED').length,
    rejected: currentUserSubmissions.filter(s => s.status === 'REJECTED').length,
    revision: currentUserSubmissions.filter(s => s.status === 'REVISION_NEEDED').length,
  }

  return (
    <>
      <header className="bg-background sticky top-0 z-10 flex shrink-0 items-center gap-2 border-b p-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Mes Soumissions</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>

      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Mes Soumissions</h1>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="py-4">
              <CardTitle className="text-sm font-medium">Total</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="py-4">
              <CardTitle className="text-sm font-medium">En attente</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="py-4">
              <CardTitle className="text-sm font-medium">Validés</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.approved}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="py-4">
              <CardTitle className="text-sm font-medium">À réviser</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{stats.revision}</div>
            </CardContent>
          </Card>
        </div>

        <div className="flex gap-4 items-center">
          <div className="flex-1">
            <Input
              placeholder="Rechercher une soumission..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <Filter className="mr-2 h-4 w-4" />
                Filtrer par statut
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setStatusFilter(null)}>
                Tous
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter('PENDING')}>
                En attente
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter('APPROVED')}>
                Validés
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter('REJECTED')}>
                Rejetés
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter('REVISION_NEEDED')}>
                À réviser
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {currentUserSubmissions.length === 0 ? (
          <div className="text-center py-10 text-muted-foreground">
            Vous n'avez pas encore fait de soumission pour la période en cours
          </div>
        ) : (
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Titre</TableHead>
                  <TableHead>Catégorie</TableHead>
                  <TableHead>Quantité</TableHead>
                  <TableHead>Prix Total</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Date de soumission</TableHead>
                  <TableHead>Commentaire</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentUserSubmissions.map((submission) => (
                  <TableRow key={submission.id}>
                    <TableCell className="font-medium">{submission.title}</TableCell>
                    <TableCell>{submission.category.name}</TableCell>
                    <TableCell>{submission.quantity}</TableCell>
                    <TableCell>{formatPrice(submission.quantity * submission.unitPrice)}</TableCell>
                    <TableCell>{getStatusBadge(submission.status)}</TableCell>
                    <TableCell>{formatDate(submission.createdAt.toString())}</TableCell>
                    <TableCell>
                      {submission.feedback && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleFeedbackClick(submission?.feedback ? submission.feedback : "")}
                        >
                          <MessageSquare className="h-4 w-4" />
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        <ViewFeedbackDialog
          open={isFeedbackDialogOpen}
          onOpenChange={setIsFeedbackDialogOpen}
          feedback={selectedFeedback}
        />
      </div>
    </>
  )
} 