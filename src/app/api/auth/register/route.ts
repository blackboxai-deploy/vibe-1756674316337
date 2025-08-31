import { NextRequest, NextResponse } from 'next/server';
import { registerUser, AuthError } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, username, password, firstName, lastName } = body;

    // Validate required fields
    if (!email || !username || !password) {
      return NextResponse.json(
        { error: 'Email, username, and password are required' },
        { status: 400 }
      );
    }

    // Register user
    const result = await registerUser({
      email,
      username,
      password,
      firstName,
      lastName,
    });

    return NextResponse.json({
      success: true,
      data: result,
      message: 'Registration successful',
    });

  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.status }
      );
    }

    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}