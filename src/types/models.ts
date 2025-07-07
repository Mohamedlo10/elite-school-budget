// Role enum
export enum Role {
    ADMIN = 'ADMIN',
    DEPARTMENT_HEAD = 'DEPARTMENT_HEAD',
    STAFF = 'STAFF'
  }
  
  // SubmissionStatus enum
  export enum SubmissionStatus {
    PENDING = 'PENDING',
    APPROVED = 'APPROVED',
    REJECTED = 'REJECTED',
    REVISION_NEEDED = 'REVISION_NEEDED'
  }
  
  // PeriodStatus enum
  export enum PeriodStatus {
    OPEN = 'OPEN',
    CLOSED = 'CLOSED',
    ARCHIVED = 'ARCHIVED'
  }
  
  // User type
  export type User = {
    id: string;
    email: string;
    name: string;
    password: string;
    role: Role;
    createdAt: Date;
    updatedAt: Date;
    departmentId?: string;
    department?: Department;
    submissions: Submission[];
  }
  
  // Department type
  export type Department = {
    id: string;
    name: string;
    users: User[];
    submissions: Submission[];
    periods: SubmissionPeriod[];
    categories: Category[];
  }
  
  // SubmissionPeriod type
  export type SubmissionPeriod = {
    id: string;
    year: number;
    startDate: Date;
    endDate: Date;
    status: 'OPEN' | 'CLOSED' | 'ARCHIVED';
    department: Department;
    departmentId: string;
    submissions: Submission[];
    createdAt: Date;
    updatedAt: Date;
  }
  
  // Category type
  export type Category = {
    id: string;
    name: string;
    description?: string;
    submissions: Submission[];
    department?: Department;
    departmentId?: string;
  }
  
  // Submission type
  export type Submission = {
    id: string;
    title: string;
    description: string;
    unitPrice: number;
    quantity: number;
    reference?: string;
    justification?: string;
    status: SubmissionStatus;
    feedback?: string;
    user: User;
    userId: string;
    department: Department;
    departmentId: string;
    category: Category;
    categoryId: string;
    period: SubmissionPeriod;
    periodId: string;
    createdAt: Date;
    updatedAt: Date;
  }