import { NextRequest, NextResponse } from 'next/server';
import { withRoles } from '@/lib/middleware/auth-middleware';
import * as submissionsService from '@/lib/services/submissions-service';
import { Role } from '@prisma/client';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  
  return withRoles(
    request,
    async () => {
      try {
        const body = await request.json();
        const { status, feedback } = body;
        
        if (!status) {
          return NextResponse.json(
            { message: 'Status is required' },
            { status: 400 }
          );
        }
        
        const submission = await submissionsService.updateStatus(id, status, feedback);
        return NextResponse.json(submission);
      } catch (error: any) {
        return NextResponse.json(
          { message: error.message || 'Failed to update submission status' },
          { status: 400 }
        );
      }
    },
    [Role.ADMIN, Role.DEPARTMENT_HEAD]
  );
} 