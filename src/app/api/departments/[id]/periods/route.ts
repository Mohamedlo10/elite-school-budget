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
        const periods = await departmentsService.findPeriods(id);
        return NextResponse.json(periods);
      } catch (error: any) {
        return NextResponse.json(
          { message: error.message || 'Failed to fetch department periods' },
          { status: 404 }
        );
      }
    },
    [Role.ADMIN, Role.DEPARTMENT_HEAD, Role.STAFF]
  );
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  
  return withRoles(
    request,
    async () => {
      try {
        const body = await request.json();
        const period = await departmentsService.createPeriod(id, body);
        return NextResponse.json(period, { status: 201 });
      } catch (error: any) {
        return NextResponse.json(
          { message: error.message || 'Failed to create submission period' },
          { status: 400 }
        );
      }
    },
    [Role.ADMIN, Role.DEPARTMENT_HEAD]
  );
} 