import { SetStateAction } from "react";
import { UserRole } from "../services/auth/auth-types";

export interface User {
  id: string;
  name: string;
  lastName: string;
  email: string;
  role: UserRole
}

export interface AuthContextData {
  user: User | null;
  setToken: React.Dispatch<SetStateAction<string | null>>;
  isAuthenticated: boolean;
  isLoading: boolean;
}