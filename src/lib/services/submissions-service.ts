import prisma from "../prisma/client";
import {
  CreateSubmissionDto,
  UpdateSubmissionDto,
} from "../types/submission-types";

export async function create(
  createSubmissionDto: CreateSubmissionDto,
  userId: string
) {
  // First verify the user belongs to the department
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { department: true },
  });

  if (!user) {
    throw new Error(`User with ID ${userId} not found`);
  }

  if (!user.departmentId) {
    throw new Error("User must belong to a department to create submissions");
  }

  // Ensure submission is created for user's department
  return prisma.submission.create({
    data: {
      ...createSubmissionDto,
      userId,
      departmentId: user.departmentId,
    },
    include: {
      user: true,
      department: true,
      category: true,
      period: true,
    },
  });
}

export async function findAll() {
  return prisma.submission.findMany({
    include: {
      user: true,
      department: true,
      category: true,
      period: true,
    },
  });
}

export async function findOne(id: string) {
  const submission = await prisma.submission.findUnique({
    where: { id },
    include: {
      user: true,
      department: true,
      category: true,
      period: true,
    },
  });

  if (!submission) {
    throw new Error(`Submission with ID ${id} not found`);
  }

  return submission;
}

export async function update(
  id: string,
  updateSubmissionDto: UpdateSubmissionDto
) {
  try {
    // Remove categoryId if it's undefined or null to satisfy Prisma's type
    const data = Object.fromEntries(
      Object.entries(updateSubmissionDto).filter(
        ([key, value]) => !(key === "categoryId" && value === undefined)
      )
    );
    return await prisma.submission.update({
      where: { id },
      data,
      include: {
        user: true,
        department: true,
        category: true,
        period: true,
      },
    });
  } catch (error) {
    throw new Error(`Submission with ID ${id} not found`);
  }
}

export async function remove(id: string) {
  try {
    return await prisma.submission.delete({
      where: { id },
      include: {
        user: true,
        department: true,
        category: true,
        period: true,
      },
    });
  } catch (error) {
    throw new Error(`Submission with ID ${id} not found`);
  }
}

export async function updateStatus(
  id: string,
  status: string,
  feedback?: string
) {
  try {
    return await prisma.submission.update({
      where: { id },
      data: {
        status: status as any,
        feedback,
      },
      include: {
        user: true,
        department: true,
        category: true,
        period: true,
      },
    });
  } catch (error) {
    throw new Error(`Submission with ID ${id} not found`);
  }
}

export async function findByDepartment(departmentId: string) {
  // First verify the department exists
  const department = await prisma.department.findUnique({
    where: { id: departmentId },
  });

  if (!department) {
    throw new Error(`Department with ID ${departmentId} not found`);
  }

  return prisma.submission.findMany({
    where: { departmentId },
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
      createdAt: "desc",
    },
  });
}
