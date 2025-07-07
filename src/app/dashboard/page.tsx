"use client"

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"

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
import { fetchDepartmentSubmissions } from "@/store/features/submissions/submissionsSlice"
import { Role } from "@/types/models"
import { AdminDashboard } from "./components/admin-dashboard"
import DepartmentHeadDashboard from "./components/department-head-dashboard"
import { StaffDashboard } from "./components/staff-dashboard"

export default function Page() {
  const { user: currentUser } = useAppSelector((state) => state.auth)
  const renderDashboard = () => {
    switch (currentUser?.role) {
      case Role.ADMIN:
        return <AdminDashboard />
      case Role.DEPARTMENT_HEAD:
        return <DepartmentHeadDashboard />
      case Role.STAFF:
        return <StaffDashboard />
      default:
        return <div>Accès non autorisé</div>
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
              <BreadcrumbPage>Overview</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>
      {renderDashboard()}
    </>
  )
}
