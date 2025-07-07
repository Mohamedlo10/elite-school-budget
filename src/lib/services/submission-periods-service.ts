import prisma from '../prisma/client';
import { CreateSubmissionPeriodDto, UpdateSubmissionPeriodDto } from '../types/submission-period-types';
import { PeriodStatus } from '@prisma/client';

export async function create(createSubmissionPeriodDto: CreateSubmissionPeriodDto) {
  return prisma.submissionPeriod.create({
    data: {
      status: PeriodStatus.OPEN,
      startDate: createSubmissionPeriodDto.startDate,
      endDate: createSubmissionPeriodDto.endDate,
      departmentId: createSubmissionPeriodDto.departmentId
    },
    include: {
      department: true,
    },
  });
}

export async function findAll() {
  return prisma.submissionPeriod.findMany({
    include: {
      department: true,
    },
  });
}

export async function findOne(id: string) {
  const period = await prisma.submissionPeriod.findUnique({
    where: { id },
    include: {
      department: true,
    },
  });

  if (!period) {
    throw new Error(`Submission period with ID ${id} not found`);
  }

  return period;
}

export async function update(id: string, updateSubmissionPeriodDto: UpdateSubmissionPeriodDto) {
  try {
    return await prisma.submissionPeriod.update({
      where: { id },
      data: updateSubmissionPeriodDto,
      include: {
        department: true,
      },
    });
  } catch (error) {
    throw new Error(`Submission period with ID ${id} not found`);
  }
}

export async function remove(id: string) {
  try {
    return await prisma.submissionPeriod.delete({
      where: { id },
      include: {
        department: true,
      },
    });
  } catch (error) {
    throw new Error(`Submission period with ID ${id} not found`);
  }
}

export async function toggleStatus(id: string) {
  const period = await prisma.submissionPeriod.findUnique({
    where: { id },
  });

  if (!period) {
    throw new Error(`Submission period with ID ${id} not found`);
  }

  const newStatus = period.status === PeriodStatus.OPEN ? PeriodStatus.CLOSED : PeriodStatus.OPEN;

  return prisma.submissionPeriod.update({
    where: { id },
    data: {
      status: newStatus,
    },
    include: {
      department: true,
    },
  });
} 