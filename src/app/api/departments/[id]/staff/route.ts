import { NextRequest, NextResponse } from 'next/server';
import { withRoles } from '@/lib/middleware/auth-middleware';
import * as departmentsService from '@/lib/services/departments-service';
import { Role } from '@prisma/client';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return withRoles(
    request,
    async () => {
      const { id } = await params;
      try {
        const staff = await departmentsService.findStaff(id);
        return NextResponse.json(staff);
      } catch (error: any) {
        return NextResponse.json(
          { message: error.message || 'Failed to fetch department staff' },
          { status: 404 }
        );
      }
    },
    [Role.ADMIN, Role.DEPARTMENT_HEAD]
  );
} 