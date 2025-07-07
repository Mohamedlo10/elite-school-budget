import prisma from '../prisma/client';
import bcrypt from 'bcrypt';
import { Role } from '@prisma/client';

export type CreateUserDto = {
  email: string;
  password: string;
  name?: string;
  role?: string;
  departmentId?: string;
};

export type UpdateUserDto = {
  email?: string;
  name?: string;
  role?: string;
  departmentId?: string;
};

export async function findAll() {
  return prisma.user.findMany({
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      department: true,
      createdAt: true,
      updatedAt: true,
    },
  });
}

export async function findOne(id: string) {
  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      department: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!user) {
    throw new Error(`User with ID ${id} not found`);
  }

  return user;
}

export async function update(id: string, updateUserDto: UpdateUserDto) {
  try {
    // Create a new data object without departmentId initially
    const { departmentId, role, ...restData } = updateUserDto;
    
    // Prepare the data object for Prisma
    const data: any = { ...restData };
    
    // If changing role to DEPARTMENT_HEAD, check if department already has a head
    if (role === Role.DEPARTMENT_HEAD && departmentId) {
      const existingHead = await prisma.user.findFirst({
        where: { 
          departmentId: departmentId,
          role: Role.DEPARTMENT_HEAD,
          id: { not: id } // Exclude the current user
        },
      });

      if (existingHead) {
        throw new Error(`Department already has a head department (${existingHead.name})`);
      }
    }

    // Add role to data if provided
    if (role) {
      data.role = role;
    }
    
    // Only add departmentId if role is not ADMIN
    if (updateUserDto.role !== 'ADMIN') {
      // If departmentId is provided, validate it
      if (departmentId) {
        const department = await prisma.department.findUnique({
          where: { id: departmentId },
        });

        if (!department) {
          throw new Error(`Department with ID ${departmentId} not found`);
        }
        
        // Add validated departmentId
        data.departmentId = departmentId;
      }
    } else {
      // For ADMIN role, explicitly set departmentId to null
      data.departmentId = null;
    }

    return await prisma.user.update({
      where: { id },
      data,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        department: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  } catch (error) {
    throw new Error(`User with ID ${id} not found`);
  }
}

export async function remove(id: string) {
  try {
    return await prisma.user.delete({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        department: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  } catch (error) {
    throw new Error(`User with ID ${id} not found`);
  }
}

export async function create(createUserDto: CreateUserDto) {
  const { email, password, name, role, departmentId } = createUserDto;

  // Check if user already exists
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw new Error('User with this email already exists');
  }

  // If trying to assign DEPARTMENT_HEAD role, check if department already has a head
  if (role === Role.DEPARTMENT_HEAD && departmentId) {
    const existingHead = await prisma.user.findFirst({
      where: { 
        departmentId: departmentId,
        role: Role.DEPARTMENT_HEAD 
      },
    });

    if (existingHead) {
      throw new Error(`Department already has a head department (${existingHead.name})`);
    }
  }

  // If departmentId is provided and role is not ADMIN, check if department exists
  if (departmentId && role !== Role.ADMIN) {
    const department = await prisma.department.findUnique({
      where: { id: departmentId },
    });

    if (!department) {
      throw new Error(`Department with ID ${departmentId} not found`);
    }
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create user
  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      name: name || email.split('@')[0],
      role: role as Role,
      departmentId: role === Role.ADMIN ? null : departmentId,
    },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      department: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return user;
}

export async function findUserSubmissions(id: string) {
  /*const user = await prisma.user.findUnique({
    where: { id },
  });
  console.log(user);
  if (!user) {
    throw new Error(`User with ID ${id} not found`);
  }*/

  const department = await prisma.department.findUnique({
    where: { id },
  });

  if (!department) {
    throw new Error(`Department with ID ${id} not found`);
  }


  return prisma.submission.findMany({
    where: { departmentId: id },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      },
      department: true,
      category: true,
      period: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
}

export async function findAUserSubmissions(id: string) {
  const user = await prisma.user.findUnique({
    where: { id },
  });
  console.log(user);
  if (!user) {
    throw new Error(`User with ID ${id} not found`);
  }


  return prisma.submission.findMany({
    where: { userId: id },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      },
      department: true,
      category: true,
      period: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
}