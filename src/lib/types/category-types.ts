export type CreateCategoryDto = {
  name: string;
  description?: string;
  departmentId?: string;
};

export type UpdateCategoryDto = {
  name?: string;
  description?: string;
  departmentId?: string;
}; 