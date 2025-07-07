"use client"

import { useEffect } from "react"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
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
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from 'recharts'
import { fetchUsers } from "@/store/features/users/usersSlice"
import { fetchDepartments } from "@/store/features/departments/departmentsSlice"
import { fetchAllSubmissions } from "@/store/features/submissions/submissionsSlice"
import { fetchCurrentPeriod } from "@/store/features/periods/periodsSlice"
import {
  Users,
  Building,
  FileText,
  Clock,
  CheckCircle,
  TrendingUp,
  Calendar,
  LayoutDashboard,
} from "lucide-react"

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8']

export function AdminDashboard() {
  const dispatch = useAppDispatch()
  const { users } = useAppSelector((state) => state.users)
  const { departments } = useAppSelector((state) => state.departments)
  const { submissions } = useAppSelector((state) => state.submissions)
  const { currentPeriod } = useAppSelector((state) => state.periods)
  const { user: currentUser } = useAppSelector((state) => state.auth)

  useEffect(() => {
    dispatch(fetchUsers())
    dispatch(fetchDepartments())
    dispatch(fetchAllSubmissions())
    // dispatch(fetchCurrentPeriod(currentUser?.department.id))
  }, [dispatch])

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF'
    }).format(price)
  }

  // Filter out admin from users count
  const filteredUsersCount = users.filter(user => user.id !== currentUser?.id).length

  // Calculate department statistics
  const departmentStats = departments.reduce((acc, dept) => {
    const deptSubmissions = submissions.filter(sub => sub.department.id === dept.id)
    acc[dept.name] = {
      totalBudget: deptSubmissions.reduce((sum, sub) => 
        sum + (sub.quantity * sub.unitPrice), 0),
      submissionCount: deptSubmissions.length,
      approvedCount: deptSubmissions.filter(sub => sub.status === 'APPROVED').length,
      pendingCount: deptSubmissions.filter(sub => sub.status === 'PENDING').length
    }
    return acc
  }, {} as Record<string, { totalBudget: number, submissionCount: number, approvedCount: number, pendingCount: number }>)

  const totalBudget = Object.values(departmentStats)
    .reduce((acc, dept) => acc + dept.totalBudget, 0)

  const pieChartData = Object.entries(departmentStats).map(([name, data]) => ({
    name,
    value: data.totalBudget
  }))

  const barChartData = Object.entries(departmentStats).map(([name, data]) => ({
    name,
    'Validés': data.approvedCount,
    'En attente': data.pendingCount
  }))

  return (
    <div className="p-6 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Administration</h1>
          <p className="text-muted-foreground">
            Vue d'ensemble de tous les départements
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
            <CardTitle className="text-sm font-medium">Départements</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{departments.length}</div>
            <p className="text-xs text-muted-foreground">
              Départements actifs
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Utilisateurs</CardTitle>
            <Users className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{filteredUsersCount}</div>
            <p className="text-xs text-muted-foreground">
              Utilisateurs enregistrés
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Soumissions</CardTitle>
            <FileText className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{submissions.length}</div>
            <p className="text-xs text-muted-foreground">
              Total des besoins
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
              Tous départements confondus
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Répartition Budget par Département</CardTitle>
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
            <CardTitle>Statut des Soumissions par Département</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barChartData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="Validés" fill="#00C49F" />
                <Bar dataKey="En attente" fill="#FFBB28" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Aperçu des Départements</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Département</TableHead>
                <TableHead>Utilisateurs</TableHead>
                <TableHead>Soumissions</TableHead>
                <TableHead>Budget Total</TableHead>
                {/*<TableHead>Statut</TableHead>*/}
              </TableRow>
            </TableHeader>
            <TableBody>
              {departments.map((department) => {
                const stats = departmentStats[department.name]
                return (
                  <TableRow key={department.id}>
                    <TableCell className="font-medium">{department.name}</TableCell>
                    <TableCell>
                      {users.filter(user => user.department?.id === department.id).length}
                    </TableCell>
                    <TableCell>{stats.submissionCount}</TableCell>
                    <TableCell>{formatPrice(stats.totalBudget)}</TableCell>
                    {/*<TableCell>
                      <Badge
                        variant="outline"
                        className={
                          stats.pendingCount > 0
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-green-100 text-green-800'
                        }
                      >
                        {stats.pendingCount > 0 ? 'En cours' : 'À jour'}
                      </Badge>
                    </TableCell>*/}
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
} 