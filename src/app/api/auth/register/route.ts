import { NextRequest, NextResponse } from 'next/server';
import { register } from '@/lib/services/auth-service';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    if (!body.email || !body.password) {
      return NextResponse.json(
        { message: 'Email and password are required' },
        { status: 400 }
      );
    }
    
    const user = await register(body);
    
    return NextResponse.json(user, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || 'An error occurred during registration' },
      { status: 400 }
    );
  }
} 