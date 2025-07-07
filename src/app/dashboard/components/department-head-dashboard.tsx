"use client"

import { useEffect } from "react"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { fetchDepartmentSubmissions } from "@/store/features/submissions/submissionsSlice"
import { fetchCurrentPeriod } from "@/store/features/periods/periodsSlice"
import { fetchDepartmentStaff } from "@/store/features/users/usersSlice"
import { 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer,
  Tooltip,
  Legend 
} from 'recharts'
import { Badge } from "@/components/ui/badge"
import { 
  Users, 
  FileText, 
  CheckCircle, 
  Clock,
  AlertCircle,
  TrendingUp,
  Calendar 
} from "lucide-react"

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8']

export default function DepartmentHeadDashboard() {
  const dispatch = useAppDispatch()
  const { submissions } = useAppSelector((state) => state.submissions)
  const { currentPeriod } = useAppSelector((state) => state.periods)
  const { users } = useAppSelector((state) => state.users)
  const { user: currentUser } = useAppSelector((state) => state.auth)

  useEffect(() => {
    if (currentUser?.department?.id) {
      dispatch(fetchDepartmentSubmissions(currentUser.department.id))
      dispatch(fetchCurrentPeriod(currentUser.department.id))
      dispatch(fetchDepartmentStaff(currentUser.department.id))
    }
  }, [dispatch, currentUser])

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF'
    }).format(price)
  }

  // Filter submissions for current period
  const currentSubmissions = submissions.filter(sub => 
    sub.periodId === currentPeriod?.id
  )

  const approvedSubmissions = currentSubmissions.filter(sub => sub.status === 'APPROVED')
  const pendingSubmissions = currentSubmissions.filter(sub => sub.status === 'PENDING')
  const revisionSubmissions = currentSubmissions.filter(sub => sub.status === 'REVISION_NEEDED')
  
  const totalBudget = approvedSubmissions.reduce((acc, sub) => {
    return acc + (sub.quantity * sub.unitPrice)
  }, 0)

  // Calculate category statistics
  const categoryStats = currentSubmissions.reduce((acc, sub) => {
    const categoryName = sub.category.name
    if (!acc[categoryName]) {
      acc[categoryName] = {
        count: 0,
        total: 0,
        approved: 0,
        pending: 0
      }
    }
    acc[categoryName].count += 1
    acc[categoryName].total += (sub.quantity * sub.unitPrice)
    if (sub.status === 'APPROVED') acc[categoryName].approved += 1
    if (sub.status === 'PENDING') acc[categoryName].pending += 1
    return acc
  }, {} as Record<string, { count: number; total: number; approved: number; pending: number }>)

  const pieChartData = Object.entries(categoryStats).map(([category, data]) => ({
    name: category,
    value: data.total
  }))

  const barChartData = Object.entries(categoryStats).map(([category, data]) => ({
    name: category,
    "Validés": data.approved,
    "En attente": data.pending
  }))

  return (
    <div className="p-6 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Tableau de Bord Département</h1>
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

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Personnel</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.length}</div>
            <p className="text-xs text-muted-foreground">
              Membres du département
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Besoins Soumis</CardTitle>
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
            <div className="text-2xl font-bold">{pendingSubmissions.length}</div>
            <p className="text-xs text-muted-foreground">
              Nécessitent validation
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Budget Total</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatPrice(totalBudget)}</div>
            <p className="text-xs text-muted-foreground">
              {approvedSubmissions.length} besoins validés
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Répartition Budget par Catégorie</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieChartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Statut des Besoins par Catégorie</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barChartData}>
                <Bar dataKey="Validés" fill="#00C49F" stackId="a" />
                <Bar dataKey="En attente" fill="#FFBB28" stackId="a" />
                <Tooltip />
                <Legend />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Submissions Table */}
      <Card>
        <CardHeader>
          <CardTitle>Dernières Soumissions</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Titre</TableHead>
                <TableHead>Demandeur</TableHead>
                <TableHead>Catégorie</TableHead>
                <TableHead>Montant</TableHead>
                <TableHead>Statut</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentSubmissions.slice(0, 5).map((submission) => (
                <TableRow key={submission.id}>
                  <TableCell className="font-medium">{submission.title}</TableCell>
                  <TableCell>{submission.user.name}</TableCell>
                  <TableCell>{submission.category.name}</TableCell>
                  <TableCell>
                    {formatPrice(submission.quantity * submission.unitPrice)}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={
                        submission.status === 'APPROVED'
                          ? 'bg-green-100 text-green-800'
                          : submission.status === 'PENDING'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }
                    >
                      {submission.status === 'APPROVED'
                        ? 'Validé'
                        : submission.status === 'PENDING'
                        ? 'En attente'
                        : 'À réviser'}
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