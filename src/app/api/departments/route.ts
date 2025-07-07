import { NextRequest, NextResponse } from 'next/server';
import { withRoles } from '@/lib/middleware/auth-middleware';
import * as departmentsService from '@/lib/services/departments-service';
import { Role } from '@prisma/client';

export async function GET(request: NextRequest) {
  return withRoles(
    request,
    async () => {
      try {
        const departments = await departmentsService.findAll();
        return NextResponse.json(departments);
      } catch (error: any) {
        return NextResponse.json(
          { message: error.message || 'Failed to fetch departments' },
          { status: 500 }
        );
      }
    },
    [Role.ADMIN]
  );
}

export async function POST(request: NextRequest) {
  return withRoles(
    request,
    async () => {
      try {
        const body = await request.json();
        const department = await departmentsService.create(body);
        return NextResponse.json(department, { status: 201 });
      } catch (error: any) {
        return NextResponse.json(
          { message: error.message || 'Failed to create department' },
          { status: 400 }
        );
      }
    },
    [Role.ADMIN]
  );
} 