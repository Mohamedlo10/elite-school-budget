import {PeriodStatus} from "@prisma/client";

export type CreateSubmissionPeriodDto = {
  startDate: Date;
  endDate: Date;
  status?: string;
  departmentId: string;
};

export type UpdateSubmissionPeriodDto = {
  startDate?: Date;
  endDate?: Date;
  status?: PeriodStatus;
}; 