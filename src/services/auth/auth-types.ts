export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
}

export interface RegisterPayload {
  name: string,
  lastName: string,
  email: string,
  password: string,
  role: UserRole
}

export interface RegisterResponse extends RegisterPayload {
  id: string,
  createdAt: string,
  updatedAt?: string | null
}

export enum UserRole {
  ADMIN = 'admin',
  TECHNICIAN = 'technician',
  CLIENT = 'client'
}