"use client"

import { useEffect } from "react"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import { fetchUserSubmissions } from "@/store/features/submissions/submissionsSlice"
import { fetchCurrentPeriod } from "@/store/features/periods/periodsSlice"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from 'recharts'
import {
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  TrendingUp,
  Calendar,
  RotateCcw,
  Loader2,
} from "lucide-react"

export function StaffDashboard() {
  const dispatch = useAppDispatch()
  const { submissions, isLoading } = useAppSelector((state) => state.submissions)
  const { currentPeriod } = useAppSelector((state) => state.periods)
  const { user: currentUser } = useAppSelector((state) => state.auth)

  useEffect(() => {
    if (currentUser?.id) {
      dispatch(fetchUserSubmissions(currentUser.id))
      if (currentUser.department?.id) {
        dispatch(fetchCurrentPeriod(currentUser.department.id))
      }
    }
  }, [dispatch, currentUser])

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

  const currentSubmissions = submissions.filter(sub => 
    sub.periodId === currentPeriod?.id
  )

  const submissionStats = currentSubmissions.reduce((acc, sub) => {
    acc[sub.status] = (acc[sub.status] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const totalAmount = currentSubmissions.reduce((acc, sub) => 
    acc + (sub.quantity * sub.unitPrice), 0)

  // Prepare data for charts
  const submissionsByCategory = currentSubmissions.reduce((acc, sub) => {
    const categoryName = sub.category.name
    if (!acc[categoryName]) {
      acc[categoryName] = {
        total: 0,
        count: 0
      }
    }
    acc[categoryName].total += (sub.quantity * sub.unitPrice)
    acc[categoryName].count += 1
    return acc
  }, {} as Record<string, { total: number; count: number }>)

  const categoryChartData = Object.entries(submissionsByCategory).map(([category, data]) => ({
    name: category,
    montant: data.total,
    nombre: data.count
  }))

  return (
    <div className="p-6 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Mes Besoins</h1>
          <p className="text-muted-foreground">
            - {currentUser?.department?.name}
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

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Soumissions</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currentSubmissions.length}</div>
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
            <div className="text-2xl font-bold">{submissionStats['PENDING'] || 0}</div>
            <p className="text-xs text-muted-foreground">
              En cours de validation
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Validés</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{submissionStats['APPROVED'] || 0}</div>
            <p className="text-xs text-muted-foreground">
              Besoins approuvés
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Montant Total</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatPrice(totalAmount)}</div>
            <p className="text-xs text-muted-foreground">
              Budget demandé
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Répartition par Catégorie</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryChartData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="montant" name="Montant" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Statut des Soumissions</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={[{
                name: 'Statut',
                'En attente': submissionStats['PENDING'] || 0,
                'Validés': submissionStats['APPROVED'] || 0,
                'À réviser': submissionStats['REVISION_NEEDED'] || 0,
                'Rejetés': submissionStats['REJECTED'] || 0,
              }]}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="En attente" fill="#FFBB28" />
                <Bar dataKey="Validés" fill="#00C49F" />
                <Bar dataKey="À réviser" fill="#0088FE" />
                <Bar dataKey="Rejetés" fill="#FF8042" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Dernières Soumissions</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Titre</TableHead>
                <TableHead>Catégorie</TableHead>
                <TableHead>Montant</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Statut</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentSubmissions.slice(0, 5).map((submission) => (
                <TableRow key={submission.id}>
                  <TableCell className="font-medium">{submission.title}</TableCell>
                  <TableCell>{submission.category.name}</TableCell>
                  <TableCell>
                    {formatPrice(submission.quantity * submission.unitPrice)}
                  </TableCell>
                  <TableCell>
                    {new Date(submission.createdAt).toLocaleDateString('fr-FR')}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={
                        submission.status === 'APPROVED'
                          ? 'bg-green-100 text-green-800'
                          : submission.status === 'PENDING'
                          ? 'bg-yellow-100 text-yellow-800'
                          : submission.status === 'REVISION_NEEDED'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-red-100 text-red-800'
                      }
                    >
                      {submission.status === 'APPROVED'
                        ? 'Validé'
                        : submission.status === 'PENDING'
                        ? 'En attente'
                        : submission.status === 'REVISION_NEEDED'
                        ? 'À réviser'
                        : 'Rejeté'}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
} 