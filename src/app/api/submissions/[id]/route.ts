import { NextRequest, NextResponse } from 'next/server';
import { withRoles, withAuth } from '@/lib/middleware/auth-middleware';
import * as submissionsService from '@/lib/services/submissions-service';
import { Role } from '@prisma/client';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  
  return withAuth(request, async () => {
    try {
      const submission = await submissionsService.findOne(id);
      return NextResponse.json(submission);
    } catch (error: any) {
      return NextResponse.json(
        { message: error.message || 'Submission not found' },
        { status: 404 }
      );
    }
  });
}

/*
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
        const submission = await submissionsService.update(id, body);
        return NextResponse.json(submission);
      } catch (error: any) {
        return NextResponse.json(
          { message: error.message || 'Failed to update submission' },
          { status: 400 }
        );
      }
    },
    [Role.ADMIN, Role.DEPARTMENT_HEAD]
  );
}*/

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  
  return withRoles(
    request,
    async () => {
      try {
        const submission = await submissionsService.remove(id);
        return NextResponse.json(submission);
      } catch (error: any) {
        return NextResponse.json(
          { message: error.message || 'Failed to delete submission' },
          { status: 400 }
        );
      }
    },
    [Role.ADMIN, Role.DEPARTMENT_HEAD]
  );
} 