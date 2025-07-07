import { NextRequest, NextResponse } from 'next/server';
import { withRoles, withAuth } from '@/lib/middleware/auth-middleware';
import * as submissionPeriodsService from '@/lib/services/submission-periods-service';
import { Role } from '@prisma/client';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  
  return withAuth(request, async () => {
    try {
      const period = await submissionPeriodsService.findOne(id);
      return NextResponse.json(period);
    } catch (error: any) {
      return NextResponse.json(
        { message: error.message || 'Submission period not found' },
        { status: 404 }
      );
    }
  });
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; periodId: string }> }
) {
  const { id, periodId } = await params;
  
  return withRoles(
    request,
    async () => {
      try {
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

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  
  return withRoles(
    request,
    async () => {
      try {
        const period = await submissionPeriodsService.remove(id);
        return NextResponse.json(period);
      } catch (error: any) {
        return NextResponse.json(
          { message: error.message || 'Failed to delete submission period' },
          { status: 400 }
        );
      }
    },
    [Role.ADMIN, Role.DEPARTMENT_HEAD]
  );
} 