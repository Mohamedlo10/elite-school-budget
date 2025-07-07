import { NextRequest, NextResponse } from 'next/server';
import { withRoles } from '@/lib/middleware/auth-middleware';
import * as categoriesService from '@/lib/services/categories-service';
import { Role } from '@prisma/client';

export async function GET(request: NextRequest) {
  return withRoles(
    request,
    async () => {
      try {
        const categories = await categoriesService.findAll();
        return NextResponse.json(categories);
      } catch (error: any) {
        return NextResponse.json(
          { message: error.message || 'Failed to fetch categories' },
          { status: 500 }
        );
      }
    },
    [Role.ADMIN, Role.DEPARTMENT_HEAD, Role.STAFF]
  );
}

export async function POST(request: NextRequest) {
  return withRoles(
    request,
    async () => {
      try {
        const body = await request.json();
        const category = await categoriesService.create(body);
        return NextResponse.json(category, { status: 201 });
      } catch (error: any) {
        return NextResponse.json(
          { message: error.message || 'Failed to create category' },
          { status: 400 }
        );
      }
    },
    [Role.ADMIN, Role.DEPARTMENT_HEAD]
  );
} 