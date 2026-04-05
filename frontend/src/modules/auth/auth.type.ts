export type UserRole = "admin" | "editor" | "carrier" | "customer" | "dealer";

export interface User {
  id: string;
  email: string;
  full_name: string | null;
  phone: string | null;
  ecosystem_id?: string | null;
  role: UserRole;
  is_active: number;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
