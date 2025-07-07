import { NextRequest, NextResponse } from 'next/server';
import { withRoles } from '@/lib/middleware/auth-middleware';
import * as submissionPeriodsService from '@/lib/services/submission-periods-service';
import { Role } from '@prisma/client';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  
  return withRoles(
    request,
    async () => {
      try {
        const period = await submissionPeriodsService.toggleStatus(id);
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