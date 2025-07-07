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
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  RotateCcw,
  MessageSquare,
  Search,
  Filter,
  Calendar,
  TimerIcon,
  Loader2
} from "lucide-react"
import { toast } from "sonner"
import { 
  fetchDepartmentSubmissions,
  updateSubmissionStatus 
} from "@/store/features/submissions/submissionsSlice"
import { fetchCurrentPeriod } from "@/store/features/periods/periodsSlice"
import { ReviewSubmissionDialog } from "@/components/dialogs/review-submission-dialog"
import { AddCommentDialog } from "@/components/dialogs/add-comment-dialog"
import { SidebarTrigger } from "@/components/ui/sidebar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import { ViewDescriptionDialog } from "@/components/dialogs/view-description-dialog"

export default function ValidationPage() {
  const dispatch = useAppDispatch()
  const { submissions, isLoading } = useAppSelector((state) => state.submissions)
  const { currentPeriod } = useAppSelector((state) => state.periods)
  const { user: currentUser } = useAppSelector((state) => state.auth)
  const [selectedSubmission, setSelectedSubmission] = useState<string | null>(null)
  const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false)
  const [selectedStatus, setSelectedStatus] = useState<string>("")
  const [isCommentDialogOpen, setIsCommentDialogOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string | null>(null)
  const [isDescriptionDialogOpen, setIsDescriptionDialogOpen] = useState(false);
  const [selectedDescription, setSelectedDescription] = useState("");

  useEffect(() => {
    if (currentUser?.department?.id) {
      dispatch(fetchDepartmentSubmissions(currentUser.department.id))
      dispatch(fetchCurrentPeriod(currentUser.department.id))
    }
  }, [dispatch, currentUser])

  // Filter submissions for current period
  const currentSubmissions = submissions.filter(sub => 
    sub.periodId === currentPeriod?.id &&
    (statusFilter ? sub.status === statusFilter : true) &&
    (searchTerm 
      ? sub.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sub.user.name.toLowerCase().includes(searchTerm.toLowerCase())
      : true
    )
  )

  const stats = {
    total: currentSubmissions.length,
    pending: currentSubmissions.filter(s => s.status === 'PENDING').length,
    approved: currentSubmissions.filter(s => s.status === 'APPROVED').length,
    rejected: currentSubmissions.filter(s => s.status === 'REJECTED').length,
    revision: currentSubmissions.filter(s => s.status === 'REVISION_NEEDED').length,
  }

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

  const handleStatusUpdate = async (id: string, status: string) => {
    setSelectedSubmission(id)
    setIsCommentDialogOpen(true)
    setSelectedStatus(status)
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

  if (isLoading) {
    return (
      <div className="p-6 flex justify-center items-center h-full">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    )
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
              <BreadcrumbPage>Validation des Besoins</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>

      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Validation des Besoins</h1>
            <p className="text-muted-foreground mt-1">
              Gérez et validez les soumissions de votre département
            </p>
          </div>
          <Badge 
            variant="outline" 
            className="px-4 py-2 flex items-center gap-2"
          >
            <Calendar className="h-4 w-4" />
            Période {currentPeriod?.status === 'OPEN' ? 'active' : 'fermée'}
          </Badge>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Soumissions</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
              <p className="text-xs text-muted-foreground">
                Pour la période en cours
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">En Attente</CardTitle>
              <Clock className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
              <p className="text-xs text-muted-foreground">
                À traiter
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Validés</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.approved}</div>
              <p className="text-xs text-muted-foreground">
                Besoins approuvés
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Rejetés</CardTitle>
              <XCircle className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{stats.rejected}</div>
              <p className="text-xs text-muted-foreground">
                Besoins rejetés
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="flex gap-4 items-center">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher par titre ou nom..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
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

        <Card>
          <CardContent className="px-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Demandeur</TableHead>
                  <TableHead>Catégorie</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Montant</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentSubmissions.map((submission) => (
                  <TableRow key={submission.id}>
                    <TableCell>{formatDate(submission.createdAt.toString())}</TableCell>
                    <TableCell>{submission.user.name}</TableCell>
                    <TableCell>{submission.category.name}</TableCell>
                    <TableCell 
                      className="max-w-xs truncate cursor-pointer hover:text-primary hover:text-blue-600"
                      onClick={() => {
                        setSelectedDescription(submission.description);
                        setIsDescriptionDialogOpen(true);
                      }}
                    >
                      {submission.description}
                    </TableCell>
                    <TableCell>{formatPrice(submission.quantity * submission.unitPrice)}</TableCell>
                    <TableCell>{getStatusBadge(submission.status)}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleStatusUpdate(submission.id, 'APPROVED')}
                          disabled={submission.status === 'APPROVED'}
                        >
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleStatusUpdate(submission.id, 'REJECTED')}
                          disabled={submission.status === 'REJECTED'}
                        >
                          <XCircle className="h-4 w-4 text-red-600" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleStatusUpdate(submission.id, 'PENDING')}
                          disabled={submission.status === 'PENDING'}
                        >
                          <TimerIcon className="h-4 w-4 text-blue-600" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <AddCommentDialog
          submissionId={selectedSubmission}
          status={selectedStatus}
          open={isCommentDialogOpen}
          onOpenChange={setIsCommentDialogOpen}
        />

        <ViewDescriptionDialog
          description={selectedDescription}
          open={isDescriptionDialogOpen}
          onOpenChange={setIsDescriptionDialogOpen}
        />
      </div>
    </>
  )
} 