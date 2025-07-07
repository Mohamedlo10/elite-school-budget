import { NextRequest, NextResponse } from 'next/server';
import { withRoles } from '@/lib/middleware/auth-middleware';
import * as usersService from '@/lib/services/users-service';
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
        const submissions = await usersService.findUserSubmissions(id);
        return NextResponse.json(submissions);
      } catch (error: any) {
        return NextResponse.json(
          { message: error.message || 'Failed to fetch user submissions' },
          { status: 404 }
        );
      }
    },
    [Role.ADMIN, Role.DEPARTMENT_HEAD, Role.STAFF]
  );
} 