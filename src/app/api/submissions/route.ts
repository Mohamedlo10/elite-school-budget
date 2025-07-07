import { NextRequest, NextResponse } from 'next/server';
import { withRoles, withAuth } from '@/lib/middleware/auth-middleware';
import * as submissionsService from '@/lib/services/submissions-service';
import { Role } from '@prisma/client';

export async function GET(request: NextRequest) {
  return withRoles(
    request,
    async () => {
      try {
        const submissions = await submissionsService.findAll();
        return NextResponse.json(submissions);
      } catch (error: any) {
        return NextResponse.json(
          { message: error.message || 'Failed to fetch submissions' },
          { status: 500 }
        );
      }
    },
    [Role.ADMIN]
  );
}

export async function POST(request: NextRequest) {
  return withAuth(request, async (req, user) => {
    try {
      const body = await req.json();
      const submission = await submissionsService.create(body, user.id);
      return NextResponse.json(submission, { status: 201 });
    } catch (error: any) {
      return NextResponse.json(
        { message: error.message || 'Failed to create submission' },
        { status: 400 }
      );
    }
  });
} 