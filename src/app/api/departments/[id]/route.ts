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
        const department = await departmentsService.findOne(id);
        return NextResponse.json(department);
      } catch (error: any) {
        return NextResponse.json(
          { message: error.message || 'Department not found' },
          { status: 404 }
        );
      }
    },
    [Role.ADMIN, Role.DEPARTMENT_HEAD]
  );
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  
  return withRoles(
    request,
    async () => {
      try {
        const body = await request.json();
        const department = await departmentsService.update(id, body);
        return NextResponse.json(department);
      } catch (error: any) {
        return NextResponse.json(
          { message: error.message || 'Failed to update department' },
          { status: 400 }
        );
      }
    },
    [Role.ADMIN]
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
        const department = await departmentsService.remove(id);
        return NextResponse.json(department);
      } catch (error: any) {
        return NextResponse.json(
          { message: error.message || 'Failed to delete department' },
          { status: 400 }
        );
      }
    },
    [Role.ADMIN]
  );
} 