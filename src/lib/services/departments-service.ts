import prisma from '../prisma/client';
import { CreateDepartmentDto } from '../types/department-types';
import { UpdateDepartmentDto } from '../types/department-types';
import { CreateSubmissionPeriodDto } from '../types/submission-period-types';
import { PeriodStatus } from '@prisma/client';

export async function create(createDepartmentDto: CreateDepartmentDto) {
  return prisma.department.create({
    data: createDepartmentDto,
  });
}

export async function findAll() {
  return prisma.department.findMany({
    include: {
      users: {
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          createdAt: true,
          updatedAt: true,
        }
      },
    },
  });
}

export async function findOne(id: string) {
  const department = await prisma.department.findUnique({
    where: { id },
    include: {
      users: {
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          createdAt: true,
          updatedAt: true,
        }
      },
    },
  });

  if (!department) {
    throw new Error(`Department with ID ${id} not found`);
  }

  return department;
}

export async function update(id: string, updateDepartmentDto: UpdateDepartmentDto) {
  try {
    return await prisma.department.update({
      where: { id },
      data: updateDepartmentDto,
    });
  } catch (error) {
    throw new Error(`Department with ID ${id} not found`);
  }
}

export async function remove(id: string) {
  try {
    return await prisma.department.delete({
      where: { id },
    });
  } catch (error) {
    throw new Error(`Department with ID ${id} not found`);
  }
}

export async function findStaff(id: string) {
  const department = await prisma.department.findUnique({
    where: { id },
    include: {
      users: {
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          createdAt: true,
          updatedAt: true,
        },
      },
    },
  });

  if (!department) {
    throw new Error(`Department with ID ${id} not found`);
  }

  return department.users;
}

export async function findCategories(id: string) {
  const department = await prisma.department.findUnique({
    where: { id },
    include: {
      categories: true,
    },
  });

  if (!department) {
    throw new Error(`Department with ID ${id} not found`);
  }

  return department.categories;
}

export async function findSubmissions(id: string) {
  const department = await prisma.department.findUnique({
    where: { id },
    include: {
      submissions: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true
            }
          },
          category: true,
          period: true
        }
      }
    }
  });

  if (!department) {
    throw new Error(`Department with ID ${id} not found`);
  }

  return department.submissions;
}

export async function findPeriods(id: string) {
  const department = await prisma.department.findUnique({
    where: { id },
    include: {
      periods: true,
    },
  });

  if (!department) {
    throw new Error(`Department with ID ${id} not found`);
  }

  return department.periods;
}

export async function createPeriod(id: string, createSubmissionPeriodDto: CreateSubmissionPeriodDto) {
  // First verify the department exists
  const department = await prisma.department.findUnique({
    where: { id },
  });

  if (!department) {
    throw new Error(`Department with ID ${id} not found`);
  }

  // Convert string dates to proper Date objects
  const startDate = new Date(createSubmissionPeriodDto.startDate);
  const endDate = new Date(createSubmissionPeriodDto.endDate);

  return prisma.submissionPeriod.create({
    data: {
      status: PeriodStatus.OPEN,
      startDate,
      endDate,
      departmentId: id,
    },
    include: {
      department: true,
    },
  });
}

export async function findCurrentPeriod(id: string) {
  const department = await prisma.department.findUnique({
    where: { id },
  });

  if (!department) {
    throw new Error(`Department with ID ${id} not found`);
  }

  // Get current date
  const currentDate = new Date();

  // Find the current open period for this department
  const currentPeriod = await prisma.submissionPeriod.findFirst({
    where: { 
      departmentId: id,
      status: PeriodStatus.OPEN,
    },
    include: {
      department: true
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  if (!currentPeriod) {
    // If no active period is found, return the most recent period
    //console.log("not found +-c*z")
    const latestPeriod = await prisma.submissionPeriod.findFirst({
      where: {
        departmentId: id
      },
      include: {
        department: true
      },
      orderBy: {
        endDate: 'desc'
      }
    });
    
    if (!latestPeriod) {
      throw new Error(`No submission periods found for department with ID ${id}`);
    }
    
    return latestPeriod;
  }

  return currentPeriod;
} 