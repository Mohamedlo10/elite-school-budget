import { NextRequest, NextResponse } from 'next/server';
import { withRoles } from '@/lib/middleware/auth-middleware';
import * as departmentsService from '@/lib/services/departments-service';
import { Role } from '@prisma/client';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  
  return withRoles(
    request,
    async () => {
      try {
        console.log('departmentId', id);
        const currentPeriod = await departmentsService.findCurrentPeriod(id);
        return NextResponse.json(currentPeriod);
      } catch (error: any) {
        return NextResponse.json(
          { message: error.message || 'Failed to fetch current department period' },
          { status: 404 }
        );
      }
    },
    [Role.ADMIN, Role.DEPARTMENT_HEAD, Role.STAFF]
  );
} 