export type CreateSubmissionDto = {
  title: string;
  description: string;
  quantity: number;
  unitPrice: number;
  reference?: string;
  justification?: string;
  categoryId: string;
  periodId: string;
};

export type UpdateSubmissionDto = {
  title?: string;
  description?: string;
  quantity?: number;
  unitPrice?: number;
  reference?: string;
  justification?: string;
  status?: string;
  feedback?: string;
  categoryId?: string;
};

export type UpdateSubmissionStatusDto = {
  status: string;
  feedback?: string;
}; 