import { NextRequest, NextResponse } from 'next/server';
import { withRoles } from '@/lib/middleware/auth-middleware';
import * as submissionPeriodsService from '@/lib/services/submission-periods-service';
import { Role } from '@prisma/client';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; periodId: string }> }
) {
  const { id, periodId } = await params;
  
  return withRoles(
    request,
    async () => {
      try {
        // We only need the periodId to toggle its status
        const period = await submissionPeriodsService.toggleStatus(periodId);
        return NextResponse.json(period);
      } catch (error: any) {
        return NextResponse.json(
          { message: error.message || 'Failed to toggle submission period status' },
          { status: 400 }
        );
      }
    },
    [Role.ADMIN, Role.DEPARTMENT_HEAD]
  );
} 