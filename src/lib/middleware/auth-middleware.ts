import { NextRequest, NextResponse } from 'next/server';
import { getUserFromRequest } from '../auth/jwt';
import prisma from '../prisma/client';

export async function withAuth(
  request: NextRequest,
  handler: (req: NextRequest, user: any) => Promise<NextResponse>
) {
  const user = await getUserFromRequest(request);
  
  if (!user) {
    return NextResponse.json(
      { message: 'Unauthorized' },
      { status: 401 }
    );
  }
  
  // Get the full user from the database
  const dbUser = await prisma.user.findUnique({
    where: { id: user.sub as string },
    select: {
      id: true,
      email: true,
      role: true,
      name: true,
      departmentId: true,
    },
  });
  
  if (!dbUser) {
    return NextResponse.json(
      { message: 'User not found' },
      { status: 401 }
    );
  }
  
  return handler(request, dbUser);
}

export async function withRoles(
  request: NextRequest,
  handler: (req: NextRequest, user: any) => Promise<NextResponse>,
  allowedRoles: string[]
) {
  return withAuth(request, async (req, user) => {
    if (!allowedRoles.includes(user.role)) {
      return NextResponse.json(
        { message: 'Forbidden: Insufficient permissions' },
        { status: 403 }
      );
    }
    
    return handler(req, user);
  });
} 