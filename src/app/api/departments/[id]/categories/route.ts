import { NextRequest, NextResponse } from 'next/server';
import { withRoles } from '@/lib/middleware/auth-middleware';
import * as departmentsService from '@/lib/services/departments-service';
import { Role } from '@prisma/client';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return withRoles(
    request,
    async () => {
      const { id } = await params;
      try {
        const categories = await departmentsService.findCategories(id);
        console.log('categories +', categories);
        return NextResponse.json(categories);
      } catch (error: any) {
        return NextResponse.json(
          { message: error.message || 'Failed to fetch department categories' },
          { status: 404 }
        );
      }
    },
    [Role.ADMIN, Role.DEPARTMENT_HEAD, Role.STAFF]
  );
}