import { NextRequest, NextResponse } from 'next/server';
import { withRoles } from '@/lib/middleware/auth-middleware';
import * as categoriesService from '@/lib/services/categories-service';
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
        const category = await categoriesService.findOne(id);
        return NextResponse.json(category);
      } catch (error: any) {
        return NextResponse.json(
          { message: error.message || 'Category not found' },
          { status: 404 }
        );
      }
    },
    [Role.ADMIN, Role.DEPARTMENT_HEAD, Role.STAFF]
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
        const category = await categoriesService.update(id, body);
        return NextResponse.json(category);
      } catch (error: any) {
        return NextResponse.json(
          { message: error.message || 'Failed to update category' },
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
        const category = await categoriesService.remove(id);
        return NextResponse.json(category);
      } catch (error: any) {
        return NextResponse.json(
          { message: error.message || 'Failed to delete category' },
          { status: 400 }
        );
      }
    },
    [Role.ADMIN, Role.DEPARTMENT_HEAD]
  );
} 