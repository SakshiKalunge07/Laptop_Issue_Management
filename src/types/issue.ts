export type IssueStatus = 'Pending' | 'Resolved';
export type Brand = 'HP' | 'Dell' | 'Asus';
export type UserRole = 'manager' | 'worker';

export interface Issue {
  id: string;
  title: string;
  description: string;
  brand: Brand;
  status: IssueStatus;
  reportedBy: string;
  assignedTo?: string;
  createdAt: string;
}

export interface Worker {
  id: string;
  name: string;
  assignedIssues: number;
}

export interface User {
  id: string;
  username: string;
  password: string;
  role: UserRole;
  name: string;
}
