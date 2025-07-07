import { NextRequest, NextResponse } from 'next/server';
import { validateUser, login } from '@/lib/services/auth-service';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;
    
    if (!email || !password) {
      return NextResponse.json(
        { message: 'Email and password are required' },
        { status: 400 }
      );
    }
    
    const user = await validateUser(email, password);
    const result = await login(user);
    
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || 'An error occurred during login' },
      { status: 401 }
    );
  }
} 