'use client'
import { useEffect } from "react"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import { fetchDepartmentSubmissions } from "@/store/features/submissions/submissionsSlice"
import { fetchCurrentPeriod } from "@/store/features/periods/periodsSlice"
import { Button } from "@/components/ui/button"
import { FileDown } from "lucide-react"
import * as XLSX from 'xlsx'
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

export default function ExportPage() {
  const dispatch = useAppDispatch()
  const { submissions } = useAppSelector((state) => state.submissions)
  const { currentPeriod } = useAppSelector((state) => state.periods)
  const { user: currentUser } = useAppSelector((state) => state.auth)

  useEffect(() => {
    if (currentUser?.department?.id) {
      dispatch(fetchDepartmentSubmissions(currentUser.department.id))
      dispatch(fetchCurrentPeriod(currentUser.department.id))
    }
  }, [dispatch, currentUser])

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF'
    }).format(price)
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
  }

  const getStatusInFrench = (status: string) => {
    switch (status) {
      case 'PENDING': return 'En attente'
      case 'APPROVED': return 'Validé'
      case 'REJECTED': return 'Rejeté'
      case 'REVISION_NEEDED': return 'À réviser'
      default: return status
    }
  }

  const handleExport = () => {
    // Filter approved submissions for current period
    const approvedSubmissions = submissions.filter(sub => 
      sub.status === 'APPROVED' && sub.periodId === currentPeriod?.id
    )

    // Calculate total budget
    const totalBudget = approvedSubmissions.reduce((acc, sub) => 
      acc + (sub.quantity * sub.unitPrice), 0
    )

    // Prepare data for export
    const data = approvedSubmissions.map(sub => ({
      'Titre': sub.title,
      'Description': sub.description,
      'Catégorie': sub.category.name,
      'Demandeur': sub.user.name,
      'Quantité': sub.quantity,
      'Prix unitaire': formatPrice(sub.unitPrice),
      'Prix total': formatPrice(sub.quantity * sub.unitPrice),
      'Date de soumission': formatDate(sub.createdAt.toString())
    }))

    // Add total rows to detailed sheet with empty line
    data.push({
      'Titre': '',
      'Description': '',
      'Catégorie': '',
      'Demandeur': '',
      'Quantité': 0,
      'Prix unitaire': '',
      'Prix total': '',
      'Date de soumission': ''
    })

    data.push({
      'Titre': 'BUDGET TOTAL',
      'Description': '',
      'Catégorie': '',
      'Demandeur': '',
      'Quantité': 0,
      'Prix unitaire': '',
      'Prix total': formatPrice(totalBudget),
      'Date de soumission': ''
    })

    // Create summary by category
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

    const summaryData = Object.entries(summaryByCategory).map(([category, data]) => ({
      'Catégorie': category,
      'Nombre de besoins': data.count,
      'Budget total': formatPrice(data.total)
    }))

    // Add total rows to summary sheet with empty line
    summaryData.push({
      'Catégorie': '',
      'Nombre de besoins': 0,
      'Budget total': ''
    })

    summaryData.push({
      'Catégorie': 'BUDGET TOTAL',
      'Nombre de besoins': approvedSubmissions.length,
      'Budget total': formatPrice(totalBudget)
    })

    // Create workbook with multiple sheets
    const wb = XLSX.utils.book_new()

    // Add detailed submissions sheet
    const ws1 = XLSX.utils.json_to_sheet(data)
    
    // Style the total row in the detailed sheet
    const lastRow = data.length
    ws1['!rows'] = Array(lastRow).fill(null)
    ws1['!rows'][lastRow - 1] = { hidden: false }
    const range = XLSX.utils.decode_range(ws1['!ref'] || 'A1')
    for (let C = range.s.c; C <= range.e.c; C++) {
      const cell = XLSX.utils.encode_cell({ r: lastRow - 1, c: C })
      if (!ws1[cell]) ws1[cell] = { v: '' }
      ws1[cell].s = { fill: { fgColor: { rgb: "90EE90" } } }
    }

    XLSX.utils.book_append_sheet(wb, ws1, "Besoins Détaillés")

    // Add summary sheet
    const ws2 = XLSX.utils.json_to_sheet(summaryData)
    
    // Style the total row in the summary sheet
    const lastSummaryRow = summaryData.length
    ws2['!rows'] = Array(lastSummaryRow).fill(null)
    ws2['!rows'][lastSummaryRow - 1] = { hidden: false }
    const summaryRange = XLSX.utils.decode_range(ws2['!ref'] || 'A1')
    for (let C = summaryRange.s.c; C <= summaryRange.e.c; C++) {
      const cell = XLSX.utils.encode_cell({ r: lastSummaryRow - 1, c: C })
      if (!ws2[cell]) ws2[cell] = { v: '' }
      ws2[cell].s = { fill: { fgColor: { rgb: "90EE90" } } }
    }

    XLSX.utils.book_append_sheet(wb, ws2, "Synthèse par Catégorie")

    // Generate filename with department and period info
    const fileName = `besoins_${currentUser?.department?.name}_${currentPeriod?.year}.xlsx`
    
    // Export the file
    XLSX.writeFile(wb, fileName)
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
              <BreadcrumbPage>Export</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Export des Besoins</h1>
        <Button onClick={handleExport}>
          <FileDown className="mr-2 h-4 w-4" />
          Exporter en XLSX
        </Button>
      </div>

      <div className="text-sm text-muted-foreground">
        <p>Le fichier exporté contiendra :</p>
        <ul className="list-disc list-inside mt-2 space-y-1">
          <li>Une feuille détaillée de tous les besoins validés</li>
          <li>Une synthèse par catégorie avec les totaux</li>
          <li>Les informations complètes (prix, quantités, demandeurs, etc.)</li>
        </ul>
      </div>
    </div>
    </>
  )
} 