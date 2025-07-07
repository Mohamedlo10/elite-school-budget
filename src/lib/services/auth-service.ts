import bcrypt from 'bcrypt';
import prisma from '../prisma/client';
import { signJWT } from '../auth/jwt';
import { Role } from '@/types/models';
import * as usersService from './users-service';

export type RegisterDto = {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  role?: Role;
  departmentId?: string;
};

export type LoginDto = {
  email: string;
  password: string;
};

export async function validateUser(email: string, password: string) {
  const user = await prisma.user.findUnique({
    where: { email },
    include: {
      department: true,
    },
  });

  if (!user) {
    throw new Error('User not found');
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new Error('Invalid credentials');
  }

  return user;
}

export async function login(user: any) {
  const payload = {
    email: user.email,
    sub: user.id,
    role: user.role,
    departmentId: user.departmentId,
  };

  const token = await signJWT(payload);

  return {
    access_token: token,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      department: user.department,
    },
  };
}

export async function register(registerDto: RegisterDto) {
  const { email, password, firstName, lastName, role = Role.STAFF, departmentId } = registerDto;
  
  // Format name from firstName and lastName
  const name = firstName && lastName 
    ? `${firstName} ${lastName}` 
    : (firstName || lastName || undefined);
  
  // Use the centralized user creation service
  return usersService.create({
    email,
    password,
    name,
    role: role as string, // Convert Role enum to string to match CreateUserDto
    departmentId
  });
} 