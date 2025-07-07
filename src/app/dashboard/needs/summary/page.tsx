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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { fetchDepartmentSubmissions } from "@/store/features/submissions/submissionsSlice"
import { Loader2 } from "lucide-react"
export default function NeedsSummaryPage() {
  const dispatch = useAppDispatch()
  const { submissions, isLoading } = useAppSelector((state) => state.submissions)
  const { user: currentUser } = useAppSelector((state) => state.auth)

  useEffect(() => {
    if (currentUser?.department?.id) {
      dispatch(fetchDepartmentSubmissions(currentUser.department.id))
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

  const approvedSubmissions = submissions.filter(sub => sub.status === 'APPROVED')
  
  const totalBudget = approvedSubmissions.reduce((acc, sub) => {
    return acc + (sub.quantity * sub.unitPrice)
  }, 0)

  const summaryByCategory = approvedSubmissions.reduce((acc, sub) => {
    const categoryName = sub.category.name
    if (!acc[categoryName]) {
      acc[categoryName] = {
        count: 0,
        total: 0
      }
    }
    acc[categoryName].count += 1
    acc[categoryName].total += (sub.quantity * sub.unitPrice)
    return acc
  }, {} as Record<string, { count: number; total: number }>)

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Synthèse des Besoins</h1>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Budget Total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatPrice(totalBudget)}</div>
            <p className="text-xs text-muted-foreground">
              {approvedSubmissions.length} besoins validés
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Répartition par Catégorie</h2>
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Catégorie</TableHead>
                <TableHead>Nombre de besoins</TableHead>
                <TableHead>Budget total</TableHead>
                <TableHead>% du budget</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Object.entries(summaryByCategory).map(([category, data]) => (
                <TableRow key={category}>
                  <TableCell className="font-medium">{category}</TableCell>
                  <TableCell>{data.count}</TableCell>
                  <TableCell>{formatPrice(data.total)}</TableCell>
                  <TableCell>
                    {((data.total / totalBudget) * 100).toFixed(1)}%
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Liste des Besoins Validés</h2>
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Titre</TableHead>
                <TableHead>Catégorie</TableHead>
                <TableHead>Demandeur</TableHead>
                <TableHead>Quantité</TableHead>
                <TableHead>Prix unitaire</TableHead>
                <TableHead>Prix total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {approvedSubmissions.map((submission) => (
                <TableRow key={submission.id}>
                  <TableCell className="font-medium">{submission.title}</TableCell>
                  <TableCell>{submission.category.name}</TableCell>
                  <TableCell>{submission.user.name}</TableCell>
                  <TableCell>{submission.quantity}</TableCell>
                  <TableCell>{formatPrice(submission.unitPrice)}</TableCell>
                  <TableCell>
                    {formatPrice(submission.quantity * submission.unitPrice)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
} 