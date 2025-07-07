import { NextRequest, NextResponse } from 'next/server';
import { withRoles } from '@/lib/middleware/auth-middleware';
import * as usersService from '@/lib/services/users-service';
import { Role } from '@prisma/client';

export async function GET(request: NextRequest) {
  return withRoles(
    request,
    async () => {
      try {
        const users = await usersService.findAll();
        return NextResponse.json(users);
      } catch (error: any) {
        return NextResponse.json(
          { message: error.message || 'Failed to fetch users' },
          { status: 500 }
        );
      }
    },
    [Role.ADMIN]
  );
}

export async function POST(request: NextRequest) {
  return withRoles(
    request,
    async () => {
      try {
        const body = await request.json();
        const user = await usersService.create(body);
        return NextResponse.json(user, { status: 201 });
      } catch (error: any) {
      
        return NextResponse.json(
          { message: error.message || 'Failed to create user' },
          { status: 400 }
        );
      }
    },
    [Role.ADMIN, Role.DEPARTMENT_HEAD]
  );
} 