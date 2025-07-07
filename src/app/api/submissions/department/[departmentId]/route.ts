import { NextRequest, NextResponse } from 'next/server';
import { withRoles } from '@/lib/middleware/auth-middleware';
import * as submissionsService from '@/lib/services/submissions-service';
import { Role } from '@prisma/client';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ departmentId: string }> }
) {
  const { departmentId } = await params;
  
  return withRoles(
    request,
    async () => {
      try {
        const submissions = await submissionsService.findByDepartment(departmentId);
        return NextResponse.json(submissions);
      } catch (error: any) {
        return NextResponse.json(
          { message: error.message || 'Failed to fetch department submissions' },
          { status: 404 }
        );
      }
    },
    [Role.ADMIN, Role.DEPARTMENT_HEAD]
  );
} 