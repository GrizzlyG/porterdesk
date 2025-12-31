export enum Status {
  OK = 200,
  NOT_FOUND = 404,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  INTERNAL_SERVER_ERROR = 500,
}

export enum Level {
  PRIMARY = "PRIMARY",
  SECONDARY = "SECONDARY",
}

export enum NoticeType {
  UNIVERSITY = "UNIVERSITY",
  HOSTEL = "HOSTEL",
  INFORMAL = "INFORMAL",
}

export enum Gender {
  MALE = "MALE",
  FEMALE = "FEMALE",
}

export type FilterOptions = {
  q?: string;
  subject?: string;
  level?: string;
  status?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  page?: number;
  limit?: number;
};

export enum DayOfWeek {
  SATURDAY = "SATURDAY",
  SUNDAY = "SUNDAY",
  MONDAY = "MONDAY",
  TUESDAY = "TUESDAY",
  WEDNESDAY = "WEDNESDAY",
  THURSDAY = "THURSDAY",
  FRIDAY = "FRIDAY",
}

export enum UserRole {
  ADMIN = "ADMIN",
  MANAGER = "MANAGER",
  PORTER = "PORTER",
  STUDENT = "STUDENT",
}

export enum UserStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  SUSPENDED = "SUSPENDED",
}

// Interfaces

export interface Student {
  id: number;
  first_name?: string | null;
  last_name?: string | null;
  matricNumber: string;
  student?: User;
  userId: number;
  dob?: Date | null;
  department?: string | null;
  level?: Level;
  profileComplete?: boolean;
}

export interface User {
  id: number;
  email: string;
  password?: string;
  role?: string;
  sex?: string;
  status?: string;
  img?: string | null;
  address?: string;
  lastLogin?: Date | null;
  studentProfile?: Student | null;
  phone?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Notice {
  id: string;
  headline: string;
  subhead?: string | null;
  body: string;
  ps?: string | null;
  imageUrl?: string | null;
  fileUrl?: string | null;
  type?: string | NoticeType;
  createdAt?: Date;
  visibleToManagers?: boolean;
  visibleToPorters?: boolean;
  visibleToStudents?: boolean;
}
