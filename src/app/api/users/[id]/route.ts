import { NextRequest, NextResponse } from 'next/server';
import { withAuth, withRoles } from '@/lib/middleware/auth-middleware';
import * as usersService from '@/lib/services/users-service';
import { Role } from '@prisma/client';
import * as submissionsService from '@/lib/services/submissions-service';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  
  return withRoles(
    request,
    async () => {
      try {
        const user = await usersService.findOne(id);
        return NextResponse.json(user);
      } catch (error: any) {
        return NextResponse.json(
          { message: error.message || 'User not found' },
          { status: 404 }
        );
      }
    },
    [Role.ADMIN]
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
        const user = await usersService.update(id, body);
        return NextResponse.json(user);
      } catch (error: any) {
        return NextResponse.json(
          { message: error.message || 'Failed to update user' },
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
        const user = await usersService.remove(id);
        return NextResponse.json(user);
      } catch (error: any) {
        return NextResponse.json(
          { message: error.message || 'Failed to delete user' },
          { status: 400 }
        );
      }
    },
    [Role.ADMIN]
  );
}
/*
export async function GETSubmission(
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

export async function DELETESubmission(
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
} */