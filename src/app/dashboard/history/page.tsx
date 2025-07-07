"use client"

import { useState, useEffect, useMemo, useCallback } from "react"
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
import { MessageSquare, Filter, Calendar } from "lucide-react"
import { fetchUserSubmissions } from "@/store/features/submissions/submissionsSlice"
import { ViewFeedbackDialog } from "@/components/dialogs/view-feedback-dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Skeleton } from "@/components/ui/skeleton"

export default function HistoryPage() {
  const dispatch = useAppDispatch()
  const { submissions, isLoading } = useAppSelector((state) => state.submissions)
  const { user: currentUser } = useAppSelector((state) => state.auth)
  const [selectedFeedback, setSelectedFeedback] = useState("")
  const [isFeedbackDialogOpen, setIsFeedbackDialogOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string | null>(null)
  const [periodFilter, setPeriodFilter] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const itemsPerPage = 10

  useEffect(() => {
    if (currentUser?.id) {
      dispatch(fetchUserSubmissions(currentUser.id))
    }
  }, [dispatch, currentUser])

  const formatDate = useCallback((date: string) => {
    return new Date(date).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
  }, [])

  const formatPrice = useCallback((price: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF'
    }).format(price)
  }, [])

  const getStatusBadge = useCallback((status: string) => {
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
  }, [])

  const handleFeedbackClick = useCallback((feedback: string) => {
    if (feedback) {
      setSelectedFeedback(feedback)
      setIsFeedbackDialogOpen(true)
    }
  }, [])

  const userSubmissions = useMemo(() => {
    return submissions.filter(sub => 
      sub.userId === currentUser?.id &&
      (statusFilter ? sub.status === statusFilter : true) &&
      (periodFilter ? sub.period.id === periodFilter : true) &&
      (searchTerm ? sub.title.toLowerCase().includes(searchTerm.toLowerCase()) : true)
    )
  }, [submissions, currentUser?.id, statusFilter, periodFilter, searchTerm])

  const paginatedSubmissions = useMemo(() => {
    const startIndex = (page - 1) * itemsPerPage;
    return userSubmissions.slice(startIndex, startIndex + itemsPerPage);
  }, [userSubmissions, page, itemsPerPage]);

  const stats = useMemo(() => ({
    total: userSubmissions.length,
    approved: userSubmissions.filter(s => s.status === 'APPROVED').length,
    rejected: userSubmissions.filter(s => s.status === 'REJECTED').length,
    totalAmount: userSubmissions.reduce((acc, s) => acc + (s.quantity * s.unitPrice), 0)
  }), [userSubmissions])

  const uniquePeriods = useMemo(() => {
    if (!submissions.length) return [];
    
    const periodMap = new Map();
    
    submissions.forEach(sub => {
      if (sub.period && sub.period.id && !periodMap.has(sub.period.id)) {
        periodMap.set(sub.period.id, {
          id: sub.period.id,
          name: `${formatDate(sub.period.startDate.toString())} - ${formatDate(sub.period.endDate.toString())}`
        });
      }
    });
    
    return Array.from(periodMap.values());
  }, [submissions, formatDate]);

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
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
                <BreadcrumbPage>Historique</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>
        
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Historique des Soumissions</h1>
        </div>
        
        <div className="grid gap-4 md:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="py-4">
                <Skeleton className="h-4 w-24" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-12" />
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="border rounded-lg p-4">
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
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
              <BreadcrumbPage>Historique</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>

      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Historique des Soumissions</h1>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="py-4">
              <CardTitle className="text-sm font-medium">Total Soumissions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
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
              <CardTitle className="text-sm font-medium">Rejetés</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{stats.rejected}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="py-4">
              <CardTitle className="text-sm font-medium">Montant Total</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatPrice(stats.totalAmount)}</div>
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
              <DropdownMenuItem onClick={() => setStatusFilter('APPROVED')}>
                Validés
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter('REJECTED')}>
                Rejetés
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <Calendar className="mr-2 h-4 w-4" />
                Filtrer par période
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setPeriodFilter(null)}>
                Toutes les périodes
              </DropdownMenuItem>
              {uniquePeriods.map(period => (
                <DropdownMenuItem 
                  key={period.id} 
                  onClick={() => setPeriodFilter(period.id)}
                >
                  {period.name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {userSubmissions.length === 0 ? (
          <div className="text-center py-10 text-muted-foreground">
            Aucune soumission trouvée
          </div>
        ) : (
          <>
            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Titre</TableHead>
                    <TableHead>Catégorie</TableHead>
                    <TableHead>Période</TableHead>
                    <TableHead>Quantité</TableHead>
                    <TableHead>Prix Total</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Date de soumission</TableHead>
                    <TableHead>Commentaire</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedSubmissions.map((submission) => (
                    <TableRow key={submission.id}>
                      <TableCell className="font-medium">{submission.title}</TableCell>
                      <TableCell>{submission.category.name}</TableCell>
                      <TableCell>{formatDate(submission.period.startDate.toString()) + " - " + formatDate(submission.period.endDate.toString())}</TableCell>
                      <TableCell>{submission.quantity}</TableCell>
                      <TableCell>{formatPrice(submission.quantity * submission.unitPrice)}</TableCell>
                      <TableCell>{getStatusBadge(submission.status)}</TableCell>
                      <TableCell>{formatDate(submission.createdAt.toString())}</TableCell>
                      <TableCell>
                        {submission.feedback && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleFeedbackClick(submission.feedback || "")}
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
            
            {userSubmissions.length > itemsPerPage && (
              <div className="flex justify-center mt-4 gap-2">
                <Button 
                  variant="outline" 
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                >
                  Précédent
                </Button>
                <div className="flex items-center mx-2">
                  Page {page} sur {Math.ceil(userSubmissions.length / itemsPerPage)}
                </div>
                <Button 
                  variant="outline" 
                  onClick={() => setPage(p => p + 1)}
                  disabled={page >= Math.ceil(userSubmissions.length / itemsPerPage)}
                >
                  Suivant
                </Button>
              </div>
            )}
          </>
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