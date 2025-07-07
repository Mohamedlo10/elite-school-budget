import { NextRequest, NextResponse } from 'next/server';
import { withRoles, withAuth } from '@/lib/middleware/auth-middleware';
import * as submissionPeriodsService from '@/lib/services/submission-periods-service';
import { Role } from '@prisma/client';

export async function GET(request: NextRequest) {
  return withAuth(request, async () => {
    try {
      const periods = await submissionPeriodsService.findAll();
      return NextResponse.json(periods);
    } catch (error: any) {
      return NextResponse.json(
        { message: error.message || 'Failed to fetch submission periods' },
        { status: 500 }
      );
    }
  });
}

export async function POST(request: NextRequest) {
  return withRoles(
    request,
    async () => {
      try {
        const body = await request.json();
        const period = await submissionPeriodsService.create(body);
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